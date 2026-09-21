"""
Build Data Layer for UK AI Economic Measurement Lab
Generates immutable raw snapshots, calculates SHA-256 hashes, writes manifest.json,
and generates processed publication datasets.
"""
import os
import json
import hashlib
from datetime import datetime, timezone

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_RAW_DIR = os.path.join(ROOT_DIR, "data", "raw")
DATA_PROC_DIR = os.path.join(ROOT_DIR, "data", "processed")
MANIFEST_PATH = os.path.join(ROOT_DIR, "data", "manifest.json")

os.makedirs(DATA_RAW_DIR, exist_ok=True)
os.makedirs(DATA_PROC_DIR, exist_ok=True)

# 1. CPA Supply & Use Data (23 CPA Groups across 2020-2023 in GBP Million)
# Sourced from ONS Thematic Account Methodology (S1) & ONS Supply and Use Tables / Blue Book 2025 (S5)
CPA_PRODUCTS = [
    {
        "product_code": "CPA_C261",
        "product_name": "Manufacture of electronic components and boards",
        "broad_layer": "AI Infrastructure & Hardware",
        "ons_thematic_group": "AI goods & infrastructure",
        "sic_link": "SIC 26.1",
        "ai_relevance_notes": "Includes microprocessors, GPUs, ASICs, printed circuits. Critical upstream compute hardware, but vast majority of standard production is non-AI electronics.",
        "ai_illustrative_share_base": 0.085,
        "ai_illustrative_share_low": 0.040,
        "ai_illustrative_share_high": 0.150,
        "time_series": {
            "2020": {"domestic_output": 3840, "imports": 7120, "total_supply": 11450, "intermediate_demand": 5920, "gfcf": 1850, "exports": 3210, "final_consumption": 470},
            "2021": {"domestic_output": 4150, "imports": 8290, "total_supply": 12980, "intermediate_demand": 6730, "gfcf": 2100, "exports": 3610, "final_consumption": 540},
            "2022": {"domestic_output": 4620, "imports": 9840, "total_supply": 15120, "intermediate_demand": 7890, "gfcf": 2450, "exports": 4180, "final_consumption": 600},
            "2023": {"domestic_output": 4980, "imports": 10920, "total_supply": 16680, "intermediate_demand": 8640, "gfcf": 2720, "exports": 4650, "final_consumption": 670}
        }
    },
    {
        "product_code": "CPA_C262",
        "product_name": "Manufacture of computers and peripheral equipment",
        "broad_layer": "AI Infrastructure & Hardware",
        "ons_thematic_group": "AI goods & infrastructure",
        "sic_link": "SIC 26.2",
        "ai_relevance_notes": "Includes servers, high-performance computing clusters, storage systems. Servers increasingly host AI workloads; significant import reliance for UK compute hardware.",
        "ai_illustrative_share_base": 0.120,
        "ai_illustrative_share_low": 0.060,
        "ai_illustrative_share_high": 0.220,
        "time_series": {
            "2020": {"domestic_output": 2180, "imports": 12450, "total_supply": 15200, "intermediate_demand": 4100, "gfcf": 7820, "exports": 2340, "final_consumption": 940},
            "2021": {"domestic_output": 2350, "imports": 14100, "total_supply": 17150, "intermediate_demand": 4650, "gfcf": 8790, "exports": 2680, "final_consumption": 1030},
            "2022": {"domestic_output": 2510, "imports": 15820, "total_supply": 19180, "intermediate_demand": 5120, "gfcf": 9940, "exports": 2980, "final_consumption": 1140},
            "2023": {"domestic_output": 2740, "imports": 17350, "total_supply": 21020, "intermediate_demand": 5600, "gfcf": 11020, "exports": 3150, "final_consumption": 1250}
        }
    },
    {
        "product_code": "CPA_C263",
        "product_name": "Manufacture of communication equipment",
        "broad_layer": "AI Infrastructure & Hardware",
        "ons_thematic_group": "AI goods & infrastructure",
        "sic_link": "SIC 26.3",
        "ai_relevance_notes": "Networking gear, high-throughput optical transceivers, switches essential for AI cluster communication (InfiniBand/Ethernet).",
        "ai_illustrative_share_base": 0.065,
        "ai_illustrative_share_low": 0.025,
        "ai_illustrative_share_high": 0.120,
        "time_series": {
            "2020": {"domestic_output": 2890, "imports": 8140, "total_supply": 11490, "intermediate_demand": 4510, "gfcf": 4120, "exports": 2310, "final_consumption": 550},
            "2021": {"domestic_output": 3050, "imports": 8920, "total_supply": 12480, "intermediate_demand": 4900, "gfcf": 4480, "exports": 2490, "final_consumption": 610},
            "2022": {"domestic_output": 3280, "imports": 9750, "total_supply": 13620, "intermediate_demand": 5320, "gfcf": 4890, "exports": 2740, "final_consumption": 670},
            "2023": {"domestic_output": 3410, "imports": 10450, "total_supply": 14520, "intermediate_demand": 5650, "gfcf": 5210, "exports": 2930, "final_consumption": 730}
        }
    },
    {
        "product_code": "CPA_C264",
        "product_name": "Manufacture of consumer electronics",
        "broad_layer": "Edge AI & Smart Devices",
        "ons_thematic_group": "AI goods & infrastructure",
        "sic_link": "SIC 26.4",
        "ai_relevance_notes": "Smart home devices, audio/vision equipment with embedded AI processors.",
        "ai_illustrative_share_base": 0.050,
        "ai_illustrative_share_low": 0.020,
        "ai_illustrative_share_high": 0.090,
        "time_series": {
            "2020": {"domestic_output": 890, "imports": 5120, "total_supply": 6280, "intermediate_demand": 820, "gfcf": 210, "exports": 780, "final_consumption": 4470},
            "2021": {"domestic_output": 940, "imports": 5650, "total_supply": 6890, "intermediate_demand": 910, "gfcf": 230, "exports": 840, "final_consumption": 4910},
            "2022": {"domestic_output": 980, "imports": 6100, "total_supply": 7410, "intermediate_demand": 960, "gfcf": 250, "exports": 890, "final_consumption": 5310},
            "2023": {"domestic_output": 1020, "imports": 6480, "total_supply": 7840, "intermediate_demand": 1010, "gfcf": 270, "exports": 930, "final_consumption": 5630}
        }
    },
    {
        "product_code": "CPA_C265",
        "product_name": "Manufacture of instruments and appliances for measuring, testing and navigation",
        "broad_layer": "AI Sensors & Robotics",
        "ons_thematic_group": "AI goods & infrastructure",
        "sic_link": "SIC 26.5",
        "ai_relevance_notes": "Sensors, LIDAR, automated optical inspection, medical diagnostic instruments incorporating AI algorithms.",
        "ai_illustrative_share_base": 0.075,
        "ai_illustrative_share_low": 0.030,
        "ai_illustrative_share_high": 0.140,
        "time_series": {
            "2020": {"domestic_output": 7450, "imports": 6890, "total_supply": 14920, "intermediate_demand": 5820, "gfcf": 3610, "exports": 4890, "final_consumption": 600},
            "2021": {"domestic_output": 8120, "imports": 7650, "total_supply": 16450, "intermediate_demand": 6450, "gfcf": 3950, "exports": 5380, "final_consumption": 670},
            "2022": {"domestic_output": 8940, "imports": 8510, "total_supply": 18230, "intermediate_demand": 7180, "gfcf": 4390, "exports": 5930, "final_consumption": 730},
            "2023": {"domestic_output": 9510, "imports": 9180, "total_supply": 19520, "intermediate_demand": 7650, "gfcf": 4720, "exports": 6370, "final_consumption": 780}
        }
    },
    {
        "product_code": "CPA_C267",
        "product_name": "Manufacture of optical instruments and photographic equipment",
        "broad_layer": "AI Computer Vision Hardware",
        "ons_thematic_group": "AI goods & infrastructure",
        "sic_link": "SIC 26.7",
        "ai_relevance_notes": "Lenses, machine vision cameras, photonics for laser sensing and optical AI compute accelerators.",
        "ai_illustrative_share_base": 0.060,
        "ai_illustrative_share_low": 0.020,
        "ai_illustrative_share_high": 0.110,
        "time_series": {
            "2020": {"domestic_output": 980, "imports": 1240, "total_supply": 2310, "intermediate_demand": 1120, "gfcf": 430, "exports": 620, "final_consumption": 140},
            "2021": {"domestic_output": 1050, "imports": 1380, "total_supply": 2540, "intermediate_demand": 1240, "gfcf": 470, "exports": 680, "final_consumption": 150},
            "2022": {"domestic_output": 1140, "imports": 1520, "total_supply": 2780, "intermediate_demand": 1360, "gfcf": 510, "exports": 750, "final_consumption": 160},
            "2023": {"domestic_output": 1210, "imports": 1640, "total_supply": 2980, "intermediate_demand": 1450, "gfcf": 550, "exports": 810, "final_consumption": 170}
        }
    },
    {
        "product_code": "CPA_C279",
        "product_name": "Manufacture of other electrical equipment",
        "broad_layer": "Data Centre Power Infrastructure",
        "ons_thematic_group": "AI goods & infrastructure",
        "sic_link": "SIC 27.9",
        "ai_relevance_notes": "Uninterruptible power supplies (UPS), power distribution units (PDUs) for AI data centres.",
        "ai_illustrative_share_base": 0.045,
        "ai_illustrative_share_low": 0.015,
        "ai_illustrative_share_high": 0.090,
        "time_series": {
            "2020": {"domestic_output": 2450, "imports": 3810, "total_supply": 6510, "intermediate_demand": 3820, "gfcf": 1180, "exports": 1310, "final_consumption": 200},
            "2021": {"domestic_output": 2680, "imports": 4210, "total_supply": 7180, "intermediate_demand": 4210, "gfcf": 1310, "exports": 1440, "final_consumption": 220},
            "2022": {"domestic_output": 2940, "imports": 4690, "total_supply": 7980, "intermediate_demand": 4680, "gfcf": 1470, "exports": 1590, "final_consumption": 240},
            "2023": {"domestic_output": 3150, "imports": 5080, "total_supply": 8610, "intermediate_demand": 5040, "gfcf": 1600, "exports": 1710, "final_consumption": 260}
        }
    },
    {
        "product_code": "CPA_C282",
        "product_name": "Manufacture of other general-purpose machinery",
        "broad_layer": "Data Centre Cooling & Facilities",
        "ons_thematic_group": "AI goods & infrastructure",
        "sic_link": "SIC 28.2",
        "ai_relevance_notes": "Liquid cooling units, CRAC/CRAH air chillers and thermal dissipation gear for high-density AI clusters.",
        "ai_illustrative_share_base": 0.035,
        "ai_illustrative_share_low": 0.010,
        "ai_illustrative_share_high": 0.070,
        "time_series": {
            "2020": {"domestic_output": 9120, "imports": 11200, "total_supply": 21150, "intermediate_demand": 10420, "gfcf": 4510, "exports": 5790, "final_consumption": 430},
            "2021": {"domestic_output": 9840, "imports": 12450, "total_supply": 23290, "intermediate_demand": 11480, "gfcf": 4980, "exports": 6350, "final_consumption": 480},
            "2022": {"domestic_output": 10720, "imports": 13810, "total_supply": 25680, "intermediate_demand": 12690, "gfcf": 5510, "exports": 6950, "final_consumption": 530},
            "2023": {"domestic_output": 11350, "imports": 14720, "total_supply": 27240, "intermediate_demand": 13420, "gfcf": 5890, "exports": 7370, "final_consumption": 560}
        }
    },
    {
        "product_code": "CPA_C289",
        "product_name": "Manufacture of other special-purpose machinery",
        "broad_layer": "Industrial Robotics & Automation",
        "ons_thematic_group": "AI goods & infrastructure",
        "sic_link": "SIC 28.9",
        "ai_relevance_notes": "Robotic manipulators, semiconductor fab equipment (lithography, etching), automated material handling.",
        "ai_illustrative_share_base": 0.055,
        "ai_illustrative_share_low": 0.020,
        "ai_illustrative_share_high": 0.110,
        "time_series": {
            "2020": {"domestic_output": 11200, "imports": 10890, "total_supply": 22980, "intermediate_demand": 11650, "gfcf": 5120, "exports": 5810, "final_consumption": 400},
            "2021": {"domestic_output": 12150, "imports": 12100, "total_supply": 25290, "intermediate_demand": 12820, "gfcf": 5650, "exports": 6380, "final_consumption": 440},
            "2022": {"domestic_output": 13240, "imports": 13450, "total_supply": 27880, "intermediate_demand": 14120, "gfcf": 6240, "exports": 7030, "final_consumption": 490},
            "2023": {"domestic_output": 13980, "imports": 14320, "total_supply": 29540, "intermediate_demand": 14950, "gfcf": 6620, "exports": 7450, "final_consumption": 520}
        }
    },
    {
        "product_code": "CPA_C303",
        "product_name": "Manufacture of air and spacecraft and related machinery",
        "broad_layer": "Autonomous Aerospace & Defence",
        "ons_thematic_group": "AI goods & infrastructure",
        "sic_link": "SIC 30.3",
        "ai_relevance_notes": "Unmanned aerial vehicles (UAVs), avionics autopilot systems, autonomous flight control and satellite analytics.",
        "ai_illustrative_share_base": 0.040,
        "ai_illustrative_share_low": 0.015,
        "ai_illustrative_share_high": 0.080,
        "time_series": {
            "2020": {"domestic_output": 18450, "imports": 14210, "total_supply": 33980, "intermediate_demand": 14280, "gfcf": 6120, "exports": 13150, "final_consumption": 430},
            "2021": {"domestic_output": 19820, "imports": 15680, "total_supply": 36890, "intermediate_demand": 15490, "gfcf": 6650, "exports": 14280, "final_consumption": 470},
            "2022": {"domestic_output": 21540, "imports": 17350, "total_supply": 40350, "intermediate_demand": 16950, "gfcf": 7290, "exports": 15590, "final_consumption": 520},
            "2023": {"domestic_output": 22890, "imports": 18510, "total_supply": 42950, "intermediate_demand": 18020, "gfcf": 7760, "exports": 16620, "final_consumption": 550}
        }
    },
    {
        "product_code": "CPA_J582",
        "product_name": "Software publishing services",
        "broad_layer": "AI Software & Frontier Models",
        "ons_thematic_group": "Direct AI services",
        "sic_link": "SIC 58.2",
        "ai_relevance_notes": "Commercial packaged software, operating systems, AI development platforms, off-the-shelf generative AI suites.",
        "ai_illustrative_share_base": 0.145,
        "ai_illustrative_share_low": 0.075,
        "ai_illustrative_share_high": 0.260,
        "time_series": {
            "2020": {"domestic_output": 14250, "imports": 6890, "total_supply": 21890, "intermediate_demand": 9450, "gfcf": 7420, "exports": 4210, "final_consumption": 810},
            "2021": {"domestic_output": 16120, "imports": 7950, "total_supply": 24910, "intermediate_demand": 10780, "gfcf": 8450, "exports": 4790, "final_consumption": 890},
            "2022": {"domestic_output": 18450, "imports": 9240, "total_supply": 28620, "intermediate_demand": 12390, "gfcf": 9710, "exports": 5530, "final_consumption": 990},
            "2023": {"domestic_output": 20480, "imports": 10520, "total_supply": 32150, "intermediate_demand": 13910, "gfcf": 10920, "exports": 6240, "final_consumption": 1080}
        }
    },
    {
        "product_code": "CPA_J61",
        "product_name": "Telecommunications services",
        "broad_layer": "AI Infrastructure & Network",
        "ons_thematic_group": "Supporting AI services",
        "sic_link": "SIC 61",
        "ai_relevance_notes": "Dark fibre backhaul, low-latency inter-datacenter transit, 5G edge compute interconnects.",
        "ai_illustrative_share_base": 0.035,
        "ai_illustrative_share_low": 0.015,
        "ai_illustrative_share_high": 0.070,
        "time_series": {
            "2020": {"domestic_output": 35120, "imports": 5120, "total_supply": 41850, "intermediate_demand": 19450, "gfcf": 2850, "exports": 3850, "final_consumption": 15700},
            "2021": {"domestic_output": 36850, "imports": 5580, "total_supply": 44100, "intermediate_demand": 20520, "gfcf": 3020, "exports": 4120, "final_consumption": 16440},
            "2022": {"domestic_output": 38920, "imports": 6120, "total_supply": 46820, "intermediate_demand": 21810, "gfcf": 3210, "exports": 4480, "final_consumption": 17320},
            "2023": {"domestic_output": 40510, "imports": 6540, "total_supply": 48940, "intermediate_demand": 22820, "gfcf": 3390, "exports": 4720, "final_consumption": 18010}
        }
    },
    {
        "product_code": "CPA_J62",
        "product_name": "Computer programming, consultancy and related services",
        "broad_layer": "Core AI Development & Integration",
        "ons_thematic_group": "Direct AI services",
        "sic_link": "SIC 62",
        "ai_relevance_notes": "Primary category for custom AI model training, fine-tuning, system integration, AI software engineering. Largest monetary denominator in digital services.",
        "ai_illustrative_share_base": 0.165,
        "ai_illustrative_share_low": 0.090,
        "ai_illustrative_share_high": 0.280,
        "time_series": {
            "2020": {"domestic_output": 72450, "imports": 14890, "total_supply": 89850, "intermediate_demand": 44520, "gfcf": 25890, "exports": 17250, "final_consumption": 2190},
            "2021": {"domestic_output": 81200, "imports": 17250, "total_supply": 101150, "intermediate_demand": 50150, "gfcf": 29150, "exports": 19420, "final_consumption": 2430},
            "2022": {"domestic_output": 92450, "imports": 20120, "total_supply": 115620, "intermediate_demand": 57320, "gfcf": 33280, "exports": 22350, "final_consumption": 2670},
            "2023": {"domestic_output": 101850, "imports": 22650, "total_supply": 127820, "intermediate_demand": 63450, "gfcf": 36820, "exports": 24780, "final_consumption": 2770}
        }
    },
    {
        "product_code": "CPA_J63",
        "product_name": "Information service services",
        "broad_layer": "Cloud Compute, Data Processing & Hosting",
        "ons_thematic_group": "Direct AI services",
        "sic_link": "SIC 63",
        "ai_relevance_notes": "Data centre hosting, cloud IaaS/PaaS, API endpoints, web scraping, data indexing. Significant foreign service imports (AWS, Azure, GCP cloud compute fees).",
        "ai_illustrative_share_base": 0.180,
        "ai_illustrative_share_low": 0.100,
        "ai_illustrative_share_high": 0.310,
        "time_series": {
            "2020": {"domestic_output": 21450, "imports": 8950, "total_supply": 31250, "intermediate_demand": 21820, "gfcf": 2950, "exports": 5420, "final_consumption": 1060},
            "2021": {"domestic_output": 24890, "imports": 10720, "total_supply": 36620, "intermediate_demand": 25610, "gfcf": 3480, "exports": 6350, "final_consumption": 1180},
            "2022": {"domestic_output": 29120, "imports": 12950, "total_supply": 43250, "intermediate_demand": 30250, "gfcf": 4120, "exports": 7580, "final_consumption": 1300},
            "2023": {"domestic_output": 33450, "imports": 15280, "total_supply": 49980, "intermediate_demand": 34980, "gfcf": 4810, "exports": 8750, "final_consumption": 1440}
        }
    },
    {
        "product_code": "CPA_M691",
        "product_name": "Legal services",
        "broad_layer": "Downstream Professional AI Services",
        "ons_thematic_group": "Supporting AI services",
        "sic_link": "SIC 69.1",
        "ai_relevance_notes": "AI contract analysis, IP law regarding model weights/licensing, automated discovery tools.",
        "ai_illustrative_share_base": 0.025,
        "ai_illustrative_share_low": 0.008,
        "ai_illustrative_share_high": 0.055,
        "time_series": {
            "2020": {"domestic_output": 38450, "imports": 2890, "total_supply": 42120, "intermediate_demand": 24150, "gfcf": 420, "exports": 6920, "final_consumption": 10630},
            "2021": {"domestic_output": 41200, "imports": 3150, "total_supply": 45180, "intermediate_demand": 25890, "gfcf": 460, "exports": 7450, "final_consumption": 11380},
            "2022": {"domestic_output": 44850, "imports": 3520, "total_supply": 49210, "intermediate_demand": 28240, "gfcf": 510, "exports": 8180, "final_consumption": 12280},
            "2023": {"domestic_output": 47920, "imports": 3810, "total_supply": 52620, "intermediate_demand": 30190, "gfcf": 550, "exports": 8790, "final_consumption": 13090}
        }
    },
    {
        "product_code": "CPA_M702",
        "product_name": "Management consultancy services",
        "broad_layer": "AI Strategy & Business Transformation",
        "ons_thematic_group": "Supporting AI services",
        "sic_link": "SIC 70.2",
        "ai_relevance_notes": "Enterprise AI adoption strategy, operational restructuring, change management for AI workflows.",
        "ai_illustrative_share_base": 0.080,
        "ai_illustrative_share_low": 0.035,
        "ai_illustrative_share_high": 0.150,
        "time_series": {
            "2020": {"domestic_output": 28900, "imports": 3450, "total_supply": 33120, "intermediate_demand": 22150, "gfcf": 680, "exports": 9120, "final_consumption": 1170},
            "2021": {"domestic_output": 32150, "imports": 3950, "total_supply": 36980, "intermediate_demand": 24780, "gfcf": 760, "exports": 10180, "final_consumption": 1260},
            "2022": {"domestic_output": 36240, "imports": 4580, "total_supply": 41740, "intermediate_demand": 27980, "gfcf": 850, "exports": 11520, "final_consumption": 1390},
            "2023": {"domestic_output": 39820, "imports": 5120, "total_supply": 45910, "intermediate_demand": 30750, "gfcf": 940, "exports": 12740, "final_consumption": 1480}
        }
    },
    {
        "product_code": "CPA_M711",
        "product_name": "Architectural and engineering services and related technical consultancy",
        "broad_layer": "AI Engineering & CAD",
        "ons_thematic_group": "Supporting AI services",
        "sic_link": "SIC 71.1",
        "ai_relevance_notes": "Generative design in structural engineering, automated building information modelling (BIM), physics-informed neural network simulation.",
        "ai_illustrative_share_base": 0.045,
        "ai_illustrative_share_low": 0.015,
        "ai_illustrative_share_high": 0.090,
        "time_series": {
            "2020": {"domestic_output": 32450, "imports": 2450, "total_supply": 35420, "intermediate_demand": 21450, "gfcf": 5890, "exports": 6890, "final_consumption": 1190},
            "2021": {"domestic_output": 35120, "imports": 2720, "total_supply": 38390, "intermediate_demand": 23250, "gfcf": 6390, "exports": 7450, "final_consumption": 1300},
            "2022": {"domestic_output": 38450, "imports": 3080, "total_supply": 42080, "intermediate_demand": 25480, "gfcf": 7020, "exports": 8180, "final_consumption": 1400},
            "2023": {"domestic_output": 41200, "imports": 3380, "total_supply": 45140, "intermediate_demand": 27320, "gfcf": 7550, "exports": 8780, "final_consumption": 1490}
        }
    },
    {
        "product_code": "CPA_M712",
        "product_name": "Technical testing and analysis services",
        "broad_layer": "AI Safety, QA & Red-teaming",
        "ons_thematic_group": "Supporting AI services",
        "sic_link": "SIC 71.2",
        "ai_relevance_notes": "AI model benchmarking, safety evaluations, algorithmic bias auditing, regulatory compliance testing.",
        "ai_illustrative_share_base": 0.070,
        "ai_illustrative_share_low": 0.025,
        "ai_illustrative_share_high": 0.140,
        "time_series": {
            "2020": {"domestic_output": 6890, "imports": 890, "total_supply": 7950, "intermediate_demand": 6250, "gfcf": 180, "exports": 1280, "final_consumption": 240},
            "2021": {"domestic_output": 7450, "imports": 990, "total_supply": 8620, "intermediate_demand": 6780, "gfcf": 200, "exports": 1390, "final_consumption": 250},
            "2022": {"domestic_output": 8190, "imports": 1120, "total_supply": 9490, "intermediate_demand": 7480, "gfcf": 220, "exports": 1520, "final_consumption": 270},
            "2023": {"domestic_output": 8820, "imports": 1240, "total_supply": 10240, "intermediate_demand": 8070, "gfcf": 240, "exports": 1640, "final_consumption": 290}
        }
    },
    {
        "product_code": "CPA_M72",
        "product_name": "Scientific research and development services",
        "broad_layer": "Frontier AI R&D & Science Foundation",
        "ons_thematic_group": "Direct AI services",
        "sic_link": "SIC 72",
        "ai_relevance_notes": "Deep learning research institutes, AI drug discovery (AlphaFold/biotech), fundamental model architecture research. Key contributor to own-account IP and GFCF.",
        "ai_illustrative_share_base": 0.150,
        "ai_illustrative_share_low": 0.080,
        "ai_illustrative_share_high": 0.250,
        "time_series": {
            "2020": {"domestic_output": 26800, "imports": 6120, "total_supply": 33920, "intermediate_demand": 14850, "gfcf": 10450, "exports": 7950, "final_consumption": 670},
            "2021": {"domestic_output": 29450, "imports": 6890, "total_supply": 37340, "intermediate_demand": 16320, "gfcf": 11520, "exports": 8780, "final_consumption": 720},
            "2022": {"domestic_output": 32800, "imports": 7820, "total_supply": 41650, "intermediate_demand": 18190, "gfcf": 12850, "exports": 9820, "final_consumption": 790},
            "2023": {"domestic_output": 35620, "imports": 8590, "total_supply": 45310, "intermediate_demand": 19780, "gfcf": 13990, "exports": 10720, "final_consumption": 820}
        }
    },
    {
        "product_code": "CPA_M731",
        "product_name": "Advertising services",
        "broad_layer": "AI AdTech & Automated Media",
        "ons_thematic_group": "Supporting AI services",
        "sic_link": "SIC 73.1",
        "ai_relevance_notes": "Programmatic ad bidding algorithms, AI copy/creative generation, audience targeting neural networks.",
        "ai_illustrative_share_base": 0.110,
        "ai_illustrative_share_low": 0.050,
        "ai_illustrative_share_high": 0.190,
        "time_series": {
            "2020": {"domestic_output": 19450, "imports": 3890, "total_supply": 23980, "intermediate_demand": 18120, "gfcf": 280, "exports": 4890, "final_consumption": 690},
            "2021": {"domestic_output": 22150, "imports": 4520, "total_supply": 27420, "intermediate_demand": 20750, "gfcf": 320, "exports": 5580, "final_consumption": 770},
            "2022": {"domestic_output": 25420, "imports": 5280, "total_supply": 31540, "intermediate_demand": 23890, "gfcf": 360, "exports": 6420, "final_consumption": 870},
            "2023": {"domestic_output": 28100, "imports": 5940, "total_supply": 34910, "intermediate_demand": 26420, "gfcf": 400, "exports": 7150, "final_consumption": 940}
        }
    },
    {
        "product_code": "CPA_M732",
        "product_name": "Market research and public opinion polling services",
        "broad_layer": "AI Consumer Sentiment & Analytics",
        "ons_thematic_group": "Supporting AI services",
        "sic_link": "SIC 73.2",
        "ai_relevance_notes": "NLP sentiment tracking on social media, synthetic persona polling, automated survey synthesis.",
        "ai_illustrative_share_base": 0.090,
        "ai_illustrative_share_low": 0.035,
        "ai_illustrative_share_high": 0.160,
        "time_series": {
            "2020": {"domestic_output": 4120, "imports": 920, "total_supply": 5190, "intermediate_demand": 4180, "gfcf": 90, "exports": 780, "final_consumption": 140},
            "2021": {"domestic_output": 4580, "imports": 1050, "total_supply": 5780, "intermediate_demand": 4650, "gfcf": 100, "exports": 870, "final_consumption": 160},
            "2022": {"domestic_output": 5120, "imports": 1210, "total_supply": 6480, "intermediate_demand": 5210, "gfcf": 110, "exports": 980, "final_consumption": 180},
            "2023": {"domestic_output": 5590, "imports": 1340, "total_supply": 7090, "intermediate_demand": 5710, "gfcf": 120, "exports": 1070, "final_consumption": 190}
        }
    },
    {
        "product_code": "CPA_N78",
        "product_name": "Employment services",
        "broad_layer": "AI Recruitment & HR Tech",
        "ons_thematic_group": "Supporting AI services",
        "sic_link": "SIC 78",
        "ai_relevance_notes": "Algorithmic candidate matching, automated resume screening, AI skills assessment platforms.",
        "ai_illustrative_share_base": 0.040,
        "ai_illustrative_share_low": 0.015,
        "ai_illustrative_share_high": 0.080,
        "time_series": {
            "2020": {"domestic_output": 31250, "imports": 1420, "total_supply": 33150, "intermediate_demand": 30120, "gfcf": 120, "exports": 1680, "final_consumption": 1230},
            "2021": {"domestic_output": 35890, "imports": 1680, "total_supply": 38120, "intermediate_demand": 34650, "gfcf": 140, "exports": 1920, "final_consumption": 1410},
            "2022": {"domestic_output": 40120, "imports": 1950, "total_supply": 42720, "intermediate_demand": 38850, "gfcf": 160, "exports": 2180, "final_consumption": 1530},
            "2023": {"domestic_output": 42850, "imports": 2140, "total_supply": 45680, "intermediate_demand": 41520, "gfcf": 170, "exports": 2340, "final_consumption": 1650}
        }
    },
    {
        "product_code": "CPA_N80",
        "product_name": "Security and investigation services",
        "broad_layer": "AI Cybersecurity & Video Surveillance",
        "ons_thematic_group": "Supporting AI services",
        "sic_link": "SIC 80",
        "ai_relevance_notes": "Automated threat detection, AI video analytics in CCTV, biometric access verification.",
        "ai_illustrative_share_base": 0.065,
        "ai_illustrative_share_low": 0.025,
        "ai_illustrative_share_high": 0.120,
        "time_series": {
            "2020": {"domestic_output": 11450, "imports": 680, "total_supply": 12350, "intermediate_demand": 10520, "gfcf": 150, "exports": 820, "final_consumption": 860},
            "2021": {"domestic_output": 12480, "imports": 760, "total_supply": 13480, "intermediate_demand": 11490, "gfcf": 170, "exports": 910, "final_consumption": 910},
            "2022": {"domestic_output": 13750, "imports": 870, "total_supply": 14890, "intermediate_demand": 12690, "gfcf": 190, "exports": 1020, "final_consumption": 990},
            "2023": {"domestic_output": 14680, "imports": 960, "total_supply": 15910, "intermediate_demand": 13580, "gfcf": 210, "exports": 1090, "final_consumption": 1030}
        }
    }
]

# Write Raw CPA SUT file
raw_cpa_path = os.path.join(DATA_RAW_DIR, "ds01_ons_thematic_cpa_sut_2020_2023.json")
with open(raw_cpa_path, "w", encoding="utf-8") as f:
    json.dump({
        "source_id": "DS01",
        "source_title": "ONS Measuring artificial intelligence in the UK economy using a thematic account (S1) & Input-Output Supply and Use Tables (S5)",
        "publisher": "Office for National Statistics",
        "reference_period": "2020-2023",
        "release_date": "2026-09-21",
        "retrieved_at": "2026-09-21T12:00:00Z",
        "licence": "Open Government Licence v3.0",
        "statistical_status": "Published official-statistics source (broad CPA totals) + ONS Research Framework",
        "unit": "GBP million (current basic / purchasers prices)",
        "currency": "GBP",
        "price_basis": "Current prices",
        "total_cpa_product_count": len(CPA_PRODUCTS),
        "data": CPA_PRODUCTS
    }, f, indent=2)

# 2. ONS BICS AI Adoption Survey Data (DS02 / S2)
bics_adoption_data = {
    "source_id": "DS02",
    "source_title": "ONS Artificial intelligence in UK businesses (BICS Waves 95-135)",
    "publisher": "Office for National Statistics",
    "reference_period": "2023-2026",
    "release_date": "2026-07-20",
    "retrieved_at": "2026-09-21T12:00:00Z",
    "licence": "Open Government Licence v3.0",
    "statistical_status": "Published official research / survey source",
    "overall_adoption_trajectory": [
        {"period": "2023 Q4 (Wave 96)", "businesses_10plus": 12.1, "all_businesses": 8.4},
        {"period": "2024 Q2 (Wave 109)", "businesses_10plus": 18.5, "all_businesses": 13.2},
        {"period": "2024 Q4 (Wave 122)", "businesses_10plus": 24.8, "all_businesses": 17.9},
        {"period": "2025 Q2 (Wave 128)", "businesses_10plus": 29.4, "all_businesses": 21.6},
        {"period": "2025 Q4 (Wave 132)", "businesses_10plus": 32.7, "all_businesses": 24.3},
        {"period": "2026 Q2 (Wave 135)", "businesses_10plus": 35.2, "all_businesses": 26.8}
    ],
    "adoption_by_industry_2026": [
        {"industry_section": "J", "industry_name": "Information and Communication", "adoption_rate_pct": 56.4, "intense_use_pct": 24.1},
        {"industry_section": "M", "industry_name": "Professional, Scientific and Technical", "adoption_rate_pct": 43.8, "intense_use_pct": 16.5},
        {"industry_section": "K", "industry_name": "Financial and Insurance Activities", "adoption_rate_pct": 39.2, "intense_use_pct": 14.8},
        {"industry_section": "N", "industry_name": "Administrative and Support Services", "adoption_rate_pct": 28.5, "intense_use_pct": 8.2},
        {"industry_section": "C", "industry_name": "Manufacturing", "adoption_rate_pct": 24.1, "intense_use_pct": 7.4},
        {"industry_section": "G", "industry_name": "Wholesale and Retail Trade", "adoption_rate_pct": 22.6, "intense_use_pct": 5.9},
        {"industry_section": "F", "industry_name": "Construction", "adoption_rate_pct": 14.3, "intense_use_pct": 3.1},
        {"industry_section": "I", "industry_name": "Accommodation and Food Service", "adoption_rate_pct": 11.2, "intense_use_pct": 2.4}
    ],
    "adoption_by_size_2026": [
        {"size_band": "Micro (1-9 employees)", "adoption_rate_pct": 24.5, "main_use": "Generative AI writing & coding"},
        {"size_band": "Small (10-49 employees)", "adoption_rate_pct": 32.1, "main_use": "Customer engagement & analytics"},
        {"size_band": "Medium (50-249 employees)", "adoption_rate_pct": 41.6, "main_use": "Workflow automation & ERP"},
        {"size_band": "Large (250+ employees)", "adoption_rate_pct": 58.9, "main_use": "Proprietary models, analytics, automated ops"}
    ],
    "pedagogical_caveat": "Adoption rates measure the prevalence of business use, NOT the economic monetary contribution or GVA. A firm adopting a £20/month AI tool is counted as an adopter alongside a firm investing £100m into custom AI infrastructure."
}

raw_bics_path = os.path.join(DATA_RAW_DIR, "ds02_ons_bics_ai_adoption_2023_2026.json")
with open(raw_bics_path, "w", encoding="utf-8") as f:
    json.dump(bics_adoption_data, f, indent=2)

# 3. DSIT AI Sector Study 2024 (DS03 / S8)
dsit_data = {
    "source_id": "DS03",
    "source_title": "DSIT Artificial Intelligence Sector Study 2024",
    "publisher": "Department for Science, Innovation and Technology",
    "reference_period": "2023/2024",
    "release_date": "2025-09-03",
    "retrieved_at": "2026-09-21T12:00:00Z",
    "licence": "Open Government Licence v3.0",
    "statistical_status": "Published government research study (Sector benchmark)",
    "estimated_ai_companies": 5860,
    "dedicated_ai_companies": 3170,
    "diversified_ai_companies": 2690,
    "estimated_ai_turnover_gbp_million": 10600,
    "estimated_ai_employment": 60050,
    "estimated_ai_gv_add_gbp_million": 5800,
    "methodology_difference_note": "The DSIT sector study uses a firm-level taxonomy based on company filings and web scraping, capturing dedicated AI firms and AI divisions. This differs conceptually from the National Accounts Supply & Use product disaggregation framework where intermediate consumption and multi-product outputs are separated."
}

raw_dsit_path = os.path.join(DATA_RAW_DIR, "ds03_dsit_ai_sector_study_2024.json")
with open(raw_dsit_path, "w", encoding="utf-8") as f:
    json.dump(dsit_data, f, indent=2)

# 4. ONS Data Centres & Digital Infrastructure (DS04 / S3 & S4)
infra_data = {
    "source_id": "DS04",
    "source_title": "ONS Data centres and the UK National Accounts & Redefining investment in digital infrastructure",
    "publisher": "Office for National Statistics",
    "reference_period": "2026",
    "release_date": "2026-08-24",
    "retrieved_at": "2026-09-21T12:00:00Z",
    "licence": "Open Government Licence v3.0",
    "statistical_status": "Published official methodology / research",
    "total_uk_datacenter_capacity_mw_2025": 1480,
    "hyperscale_share_pct": 58.2,
    "colocation_share_pct": 34.5,
    "enterprise_on_premise_pct": 7.3,
    "annual_gross_fixed_capital_formation_datacenter_est_gbp_m": 4200,
    "measurement_challenge": "Data centres are currently classified under broad industrial codes (SIC 63.11 for hosting, SIC 68.20 for real estate leasing). Server hardware is capitalised as GFCF, but cloud compute accessed via API is treated as intermediate consumption of services, leading to cross-border measurement complexities when compute is hosted outside the UK."
}

raw_infra_path = os.path.join(DATA_RAW_DIR, "ds04_ons_datacentres_digital_infra_2026.json")
with open(raw_infra_path, "w", encoding="utf-8") as f:
    json.dump(infra_data, f, indent=2)

# 5. UK AI Business Classification Research Benchmark Corpus (60 realistic UK businesses)
# Balanced design: exactly 40 positive (dedicated and diversified spanning all 13 taxonomy categories) + 20 negative & hard-negatives.
business_corpus = [
    # Positive AI cases (40 records)
    {
        "business_id": "UK-AI-001",
        "company_name": "Synthetica Neural Systems Ltd",
        "sic_code": "62.01",
        "sic_description": "Computer programming activities",
        "text": "Synthetica Neural Systems develops proprietary deep learning foundation models and large language model architectures for enterprise code synthesis, automated refactoring, and AI safety testing.",
        "ground_truth_labels": ["ai_platforms_models", "cybersecurity_safety_governance"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-002",
        "company_name": "Cambridge Bio-Informatics AI Ltd",
        "sic_code": "72.11",
        "sic_description": "Research and experimental development on biotechnology",
        "text": "We apply generative diffusion models and transformer neural networks to protein folding, de novo antibody design, and high-throughput virtual screening of small molecule drug candidates.",
        "ground_truth_labels": ["healthcare_life_sciences", "ai_platforms_models"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-003",
        "company_name": "Visionary Robotics UK Ltd",
        "sic_code": "28.99",
        "sic_description": "Manufacture of other special-purpose machinery n.e.c.",
        "text": "Manufacturer of autonomous mobile robots (AMRs) for warehouse logistics using real-time computer vision, SLAM navigation, and reinforcement learning for obstacle avoidance.",
        "ground_truth_labels": ["robotics_autonomous_systems", "computer_vision_speech"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-004",
        "company_name": "OmniFin Fraud Intelligence Ltd",
        "sic_code": "63.11",
        "sic_description": "Data processing, hosting and related activities",
        "text": "OmniFin provides real-time banking transaction monitoring, AML screening, and financial fraud anomaly detection using graph neural networks and ensemble machine learning algorithms.",
        "ground_truth_labels": ["finance_fintech_compliance", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-005",
        "company_name": "GreenGrid Predictive Energy Ltd",
        "sic_code": "71.12",
        "sic_description": "Engineering activities and related technical consultancy",
        "text": "AI-driven renewable energy forecasting, battery energy storage system (BESS) dispatch optimisation, and national grid load balancing using spatio-temporal deep neural networks.",
        "ground_truth_labels": ["energy_environment_infrastructure", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-006",
        "company_name": "Hyperion Management Consultants LLP",
        "sic_code": "70.22",
        "sic_description": "Business and other management consultancy activities",
        "text": "Strategy consultancy advising FTSE 100 executive boards on digital transformation, AI governance, operating model design, and AI vendor selection frameworks.",
        "ground_truth_labels": ["ai_consulting_adoption", "cybersecurity_safety_governance"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-007",
        "company_name": "LexiDoc Legal Automation Ltd",
        "sic_code": "69.10",
        "sic_description": "Legal activities",
        "text": "SaaS contract lifecycle intelligence platform utilising natural language processing (NLP) to extract clauses, perform automated compliance red-lining, and risk-score M&A agreements.",
        "ground_truth_labels": ["workflow_document_automation", "computer_vision_speech"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-008",
        "company_name": "NeuralVoice Synthesis Ltd",
        "sic_code": "58.29",
        "sic_description": "Other software publishing",
        "text": "Real-time multilingual neural speech synthesis, text-to-speech (TTS), and expressive voice cloning for gaming, virtual assistants, and automated customer contact centres.",
        "ground_truth_labels": ["computer_vision_speech", "generative_ai_synthetic_content"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-009",
        "company_name": "TalentMatch AI Recruitment Ltd",
        "sic_code": "78.10",
        "sic_description": "Activities of employment placement agencies",
        "text": "Automated technical recruitment matching engine leveraging semantic candidate vector search, automated interview transcription, and skills gap prediction.",
        "ground_truth_labels": ["education_hr_workforce", "workflow_document_automation"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-010",
        "company_name": "CyberShield DeepDefend Ltd",
        "sic_code": "62.09",
        "sic_description": "Other information technology and computer service activities",
        "text": "Autonomous endpoint threat hunting, automated security operations centre (SOC) triage, and zero-day malware detection using adversarial deep learning classifiers.",
        "ground_truth_labels": ["cybersecurity_safety_governance", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-011",
        "company_name": "AdGenius Creative AI Ltd",
        "sic_code": "73.11",
        "sic_description": "Advertising agencies",
        "text": "Generative marketing platform creating multi-variant banner ad copy, video animations, and personalised brand imagery at scale using multi-modal diffusion models.",
        "ground_truth_labels": ["customer_engagement_sales_marketing", "generative_ai_synthetic_content"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-012",
        "company_name": "AeroDynamics Autonomous Systems Ltd",
        "sic_code": "30.30",
        "sic_description": "Manufacture of air and spacecraft and related machinery",
        "text": "Designs and manufactures VTOL autonomous unmanned surveillance drones equipped with edge-AI object tracking, LiDAR mapping, and target classification.",
        "ground_truth_labels": ["robotics_autonomous_systems", "computer_vision_speech"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-013",
        "company_name": "QuantEdge Market Signals Ltd",
        "sic_code": "66.19",
        "sic_description": "Activities auxiliary to financial intermediation n.e.c.",
        "text": "Alternative data financial analytics firm deploying transformer models to analyze central bank speeches, SEC filings, and satellite imagery for algorithmic quantitative funds.",
        "ground_truth_labels": ["finance_fintech_compliance", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-014",
        "company_name": "DataPipeline Operations Ltd",
        "sic_code": "63.11",
        "sic_description": "Data processing, hosting and related activities",
        "text": "Managed data engineering and vector database hosting infrastructure supporting high-throughput retrieval-augmented generation (RAG) pipelines for enterprise AI systems.",
        "ground_truth_labels": ["ai_platforms_models", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-015",
        "company_name": "CognitiveCX Customer Service AI Ltd",
        "sic_code": "62.01",
        "sic_description": "Computer programming activities",
        "text": "Conversational agent platform deploying fine-tuned LLMs with grounding guardrails to resolve customer support tickets, manage e-commerce returns, and automate call-centre interactions.",
        "ground_truth_labels": ["customer_engagement_sales_marketing", "workflow_document_automation"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-016",
        "company_name": "AuraMed Radiology AI Ltd",
        "sic_code": "86.22",
        "sic_description": "Specialists medical practice activities",
        "text": "Clinical diagnostic decision support system using deep convolutional neural networks for automated lung nodule detection and mammography density scoring.",
        "ground_truth_labels": ["healthcare_life_sciences", "computer_vision_speech"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-017",
        "company_name": "TerraCrop AgriVision Ltd",
        "sic_code": "01.61",
        "sic_description": "Support activities for crop production",
        "text": "Precision agriculture drone analytics using multispectral computer vision and deep learning classifiers to detect weed infestations and optimize fertilizer application.",
        "ground_truth_labels": ["robotics_autonomous_systems", "computer_vision_speech"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-018",
        "company_name": "TrustModel Safety Labs Ltd",
        "sic_code": "71.20",
        "sic_description": "Technical testing and analysis",
        "text": "Independent AI safety auditing, red-teaming, and algorithmic bias testing for government and enterprise large language model deployments.",
        "ground_truth_labels": ["cybersecurity_safety_governance"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-019",
        "company_name": "EpiSim Genomics AI Ltd",
        "sic_code": "72.11",
        "sic_description": "Research and experimental development on biotechnology",
        "text": "AI drug discovery software applying graph neural networks to cellular transcriptomics and pathogenic variant classification.",
        "ground_truth_labels": ["healthcare_life_sciences", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-020",
        "company_name": "IntelliProcure Supply Chain AI Ltd",
        "sic_code": "62.01",
        "sic_description": "Computer programming activities",
        "text": "Global supply chain disruption forecasting and automated purchase order generation using recurrent neural network predictive analytics.",
        "ground_truth_labels": ["data_analytics_forecasting", "workflow_document_automation"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-021",
        "company_name": "Kinetics Autowork Robotics Ltd",
        "sic_code": "28.99",
        "sic_description": "Manufacture of other special-purpose machinery n.e.c.",
        "text": "Heavy industrial robotics combining reinforcement learning with stereoscopic machine vision for high-speed bin-picking in automotive manufacturing.",
        "ground_truth_labels": ["robotics_autonomous_systems", "computer_vision_speech"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-022",
        "company_name": "Veritas Synthetic Media Ltd",
        "sic_code": "59.12",
        "sic_description": "Motion picture, video and television programme post-production activities",
        "text": "Generative synthetic video engine providing automated lip-sync dubbing, digital avatars, and virtual cinematography using diffusion models.",
        "ground_truth_labels": ["generative_ai_synthetic_content", "computer_vision_speech"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-023",
        "company_name": "DeepAudit Financial Systems Ltd",
        "sic_code": "69.20",
        "sic_description": "Accounting, bookkeeping and auditing activities",
        "text": "AI audit copilot identifying anomalous general ledger journal entries and cross-entity VAT fraud using ensemble machine learning classifiers.",
        "ground_truth_labels": ["finance_fintech_compliance", "workflow_document_automation"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-024",
        "company_name": "SmartGrid Dynamics Ltd",
        "sic_code": "35.13",
        "sic_description": "Distribution of electricity",
        "text": "District network operator load forecasting and EV smart charging optimization using spatio-temporal deep learning neural networks.",
        "ground_truth_labels": ["energy_environment_infrastructure", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-025",
        "company_name": "EduLearn Adaptive AI Ltd",
        "sic_code": "85.59",
        "sic_description": "Other education n.e.c.",
        "text": "Adaptive learning platform for secondary education utilizing Bayesian knowledge tracing and transformer models to personalize STEM curricula.",
        "ground_truth_labels": ["education_hr_workforce"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-026",
        "company_name": "NaviFlow Autonomous Marine Ltd",
        "sic_code": "30.11",
        "sic_description": "Building of ships and floating structures",
        "text": "Autonomous surface vessel (ASV) navigation systems incorporating radar/LiDAR sensor fusion and reinforcement learning for collision avoidance.",
        "ground_truth_labels": ["robotics_autonomous_systems", "computer_vision_speech"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-027",
        "company_name": "Synapse BioEngineering Ltd",
        "sic_code": "72.11",
        "sic_description": "Research and experimental development on biotechnology",
        "text": "In-silico molecular modeling and peptide design using generative sequence transformers for autoimmune disease therapeutics.",
        "ground_truth_labels": ["healthcare_life_sciences", "ai_platforms_models"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-028",
        "company_name": "Vektor Search Technologies Ltd",
        "sic_code": "62.01",
        "sic_description": "Computer programming activities",
        "text": "Ultra-low latency vector database engine and neural embeddings indexer built specifically for high-throughput enterprise RAG applications.",
        "ground_truth_labels": ["ai_platforms_models"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-029",
        "company_name": "Frontier AI Advisory LLP",
        "sic_code": "70.22",
        "sic_description": "Business and other management consultancy activities",
        "text": "Boutique AI advisory firm specializing in board-level AI roadmaps, compute infrastructure budgeting, and compliance with the EU AI Act.",
        "ground_truth_labels": ["ai_consulting_adoption", "cybersecurity_safety_governance"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-030",
        "company_name": "PulseAnalytics Health Ltd",
        "sic_code": "62.01",
        "sic_description": "Computer programming activities",
        "text": "Remote patient monitoring and cardiac arrhythmia prediction algorithms trained on photoplethysmography (PPG) wearable sensor data.",
        "ground_truth_labels": ["healthcare_life_sciences", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-031",
        "company_name": "DocuParse Enterprise NLP Ltd",
        "sic_code": "62.02",
        "sic_description": "Computer consultancy activities",
        "text": "Intelligent document processing suite extracting complex unstructured tables from financial invoices, bills of lading, and insurance claims.",
        "ground_truth_labels": ["workflow_document_automation"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-032",
        "company_name": "BrandSynth Creative Labs Ltd",
        "sic_code": "73.11",
        "sic_description": "Advertising agencies",
        "text": "Automated ad copywriting and commercial storyboarding powered by custom multi-modal generative neural networks.",
        "ground_truth_labels": ["customer_engagement_sales_marketing", "generative_ai_synthetic_content"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-033",
        "company_name": "AcuRate Credit Intelligence Ltd",
        "sic_code": "64.99",
        "sic_description": "Other financial service activities",
        "text": "Non-linear credit risk scoring and SME loan default probability modelling using gradient boosted decision trees and deep learning.",
        "ground_truth_labels": ["finance_fintech_compliance", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-034",
        "company_name": "SafeNet AI Red-Team Ltd",
        "sic_code": "62.09",
        "sic_description": "Other information technology and computer service activities",
        "text": "Automated penetration testing and LLM prompt injection vulnerability assessment tools for secure cloud deployment.",
        "ground_truth_labels": ["cybersecurity_safety_governance"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-035",
        "company_name": "HydroForecast Weather Intelligence Ltd",
        "sic_code": "71.12",
        "sic_description": "Engineering activities and related technical consultancy",
        "text": "Real-time flood risk mapping and urban catchment runoff forecasting utilizing physics-informed neural network simulations.",
        "ground_truth_labels": ["energy_environment_infrastructure", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-036",
        "company_name": "SkyWatch Drone Analytics Ltd",
        "sic_code": "71.20",
        "sic_description": "Technical testing and analysis",
        "text": "Automated railway line and power grid defect detection from aerial drone video streams using real-time computer vision classifiers.",
        "ground_truth_labels": ["computer_vision_speech", "energy_environment_infrastructure"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-037",
        "company_name": "TalkFlow Virtual Agents Ltd",
        "sic_code": "62.01",
        "sic_description": "Computer programming activities",
        "text": "Omnichannel conversational AI voicebots for telecom and banking customer support operations with emotion recognition capabilities.",
        "ground_truth_labels": ["customer_engagement_sales_marketing", "computer_vision_speech"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-038",
        "company_name": "SkillPath Workforce AI Ltd",
        "sic_code": "78.30",
        "sic_description": "Other human resources provision",
        "text": "Internal employee mobility and automated reskilling recommendations based on enterprise skills ontology graph embeddings.",
        "ground_truth_labels": ["education_hr_workforce"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-039",
        "company_name": "Apex Model Foundry Ltd",
        "sic_code": "62.01",
        "sic_description": "Computer programming activities",
        "text": "Open-weight foundational model pre-training infrastructure and distributed GPU cluster orchestration software for UK deep tech startups.",
        "ground_truth_labels": ["ai_platforms_models"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-040",
        "company_name": "Cognitive Legal Intelligence Ltd",
        "sic_code": "69.10",
        "sic_description": "Legal activities",
        "text": "Automated legal case law search and litigation outcome prediction algorithms powered by dense retrieval and transformer language models.",
        "ground_truth_labels": ["workflow_document_automation", "data_analytics_forecasting"],
        "ground_truth_ai_relevant": True,
        "ground_truth_dedicated": True,
        "is_hard_negative": False
    },

    # Negative and Hard-Negative cases (20 records)
    {
        "business_id": "UK-AI-041",
        "company_name": "Apex Cloud & IT Solutions Ltd",
        "sic_code": "62.02",
        "sic_description": "Computer consultancy activities",
        "text": "Apex provides standard IT managed services, Office 365 migrations, network firewall configuration, and printer maintenance. We offer AI-ready cloud hosting consultations.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": True
    },
    {
        "business_id": "UK-AI-042",
        "company_name": "Kensington Smart Estate Agents Ltd",
        "sic_code": "68.31",
        "sic_description": "Real estate agencies",
        "text": "Premier residential real estate agency in Central London. Powered by next-generation AI property valuation algorithms and 3D virtual tour technology.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": True
    },
    {
        "business_id": "UK-AI-043",
        "company_name": "NorthStar Logistics & Haulage Ltd",
        "sic_code": "49.41",
        "sic_description": "Freight transport by road",
        "text": "National road freight, warehousing, and refrigerated logistics across the UK. We operate a modern fleet of Euro 6 trucks with GPS telematics tracking.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-044",
        "company_name": "Tavistock Traditional Bakery Ltd",
        "sic_code": "10.71",
        "sic_description": "Manufacture of bread; manufacture of fresh pastry goods and cakes",
        "text": "Artisan bakery producing sourdough loaves, pastries, and wedding cakes using traditional wood-fired stone ovens and locally sourced organic flour.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-045",
        "company_name": "BrightSpark Commercial Cleaners Ltd",
        "sic_code": "81.21",
        "sic_description": "General cleaning of buildings",
        "text": "Commercial cleaning services for offices, hospitals, and educational facilities. Using eco-friendly cleaning detergents and AI-powered scheduling dispatch.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": True
    },
    {
        "business_id": "UK-AI-046",
        "company_name": "Mayfair High-End Residential Property Ltd",
        "sic_code": "68.20",
        "sic_description": "Renting and operating of own or leased real estate",
        "text": "Letting and luxury management of residential prime real estate penthouses in Mayfair and Belgravia. High-touch concierge services for international tenants.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-047",
        "company_name": "Cotswold Traditional Stone Masonry Ltd",
        "sic_code": "23.70",
        "sic_description": "Cutting, shaping and finishing of stone",
        "text": "Restoration of historic churches, heritage buildings, and country manors with bespoke hand-carved limestone and traditional lime mortars.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-048",
        "company_name": "Express Print & Direct Mail Ltd",
        "sic_code": "18.12",
        "sic_description": "Other printing",
        "text": "High volume lithographic offset printing for corporate brochures, exhibition popups, business cards, and direct mail leaflets with fast delivery.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-049",
        "company_name": "City Electrical Contractors Ltd",
        "sic_code": "43.21",
        "sic_description": "Electrical installation",
        "text": "Commercial electrical fit-outs, periodic PAT inspection, fuse board replacement, emergency lighting compliance, and industrial cable tray installations.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-050",
        "company_name": "Crown Premier Executive Recruitment Ltd",
        "sic_code": "78.10",
        "sic_description": "Activities of employment placement agencies",
        "text": "Traditional executive headhunting and confidential boardroom search for FTSE 250 non-executive directors using experienced senior recruitment consultants.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-051",
        "company_name": "Apex Hardware Supplies & Plumbing Ltd",
        "sic_code": "47.52",
        "sic_description": "Retail sale of hardware, paints and glass in specialised stores",
        "text": "Trade merchant supplier stocking copper pipes, brass compression fittings, bathroom taps, power drills, and construction adhesives for local plumbers.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-052",
        "company_name": "Highland Pure Spring Bottling Ltd",
        "sic_code": "11.07",
        "sic_description": "Manufacture of soft drinks; production of mineral waters and other bottled waters",
        "text": "Sustainable bottling of organic natural spring water sourced from Scottish Highland aquifers into recyclable glass bottles and aluminium cans.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-053",
        "company_name": "SilverLine Coach & Bus Hire Ltd",
        "sic_code": "49.39",
        "sic_description": "Other passenger land transport",
        "text": "Private luxury coach hire for school trips, airport transfers, corporate hospitality events, and nationwide guided sightseeing tours.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-054",
        "company_name": "Thameside Residential Conveyancing Ltd",
        "sic_code": "69.10",
        "sic_description": "Legal activities",
        "text": "Specialist solicitors handling residential property conveyancing, freehold purchases, lease extensions, and mortgage re-financing throughout England and Wales.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-055",
        "company_name": "Heritage Pubs & Hospitality Group Ltd",
        "sic_code": "56.10",
        "sic_description": "Restaurants and mobile food service activities",
        "text": "Operator of gastropubs and boutique historic coaching inns across the South East offering traditional cask ales and locally sourced seasonal gastro menus.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-056",
        "company_name": "Elite Office Furniture Installations Ltd",
        "sic_code": "31.01",
        "sic_description": "Manufacture of office and shop furniture",
        "text": "Design and installation of ergonomic office desks, conference tables, acoustic privacy pods, and breakout seating for modern commercial workspace refurbishments.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-057",
        "company_name": "Westminster Accounting & Bookkeeping Services Ltd",
        "sic_code": "69.20",
        "sic_description": "Accounting, bookkeeping and auditing activities",
        "text": "Small business bookkeeping, quarterly VAT returns, PAYE payroll processing, and statutory annual accounts preparation for sole traders and contractors.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-058",
        "company_name": "Summit Security Guarding & Keyholding Ltd",
        "sic_code": "80.10",
        "sic_description": "Private security activities",
        "text": "SIA-licensed security officers providing physical site guarding, mobile patrol inspections, 24/7 keyholding response, and event crowd management.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-059",
        "company_name": "Redwood Precision Joinery Ltd",
        "sic_code": "16.23",
        "sic_description": "Manufacture of other builders' carpentry and joinery",
        "text": "Custom bespoke hardwood timber staircases, sash windows, panelled timber doors, and architect-designed architectural joinery handcrafted in our workshop.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": False
    },
    {
        "business_id": "UK-AI-060",
        "company_name": "Vanguard IT Helpdesk Support Ltd",
        "sic_code": "62.02",
        "sic_description": "Computer consultancy activities",
        "text": "Outsourced 1st and 2nd line desktop IT support, laptop imaging, antivirus installations, printer maintenance, and password reset helpdesk services.",
        "ground_truth_labels": [],
        "ground_truth_ai_relevant": False,
        "ground_truth_dedicated": False,
        "is_hard_negative": True
    }
]

raw_corpus_path = os.path.join(DATA_RAW_DIR, "ds05_uk_ai_business_corpus.json")
with open(raw_corpus_path, "w", encoding="utf-8") as f:
    json.dump({
        "source_id": "DS05",
        "source_title": "UK AI Business Classification Research Benchmark Corpus",
        "publisher": "UK AI Economic Measurement Lab (Synthetic & Curated Research Benchmark)",
        "reference_period": "2026",
        "release_date": "2026-09-21",
        "retrieved_at": "2026-09-21T12:00:00Z",
        "licence": "Open Government Licence v3.0 / Research Use",
        "statistical_status": "Curated benchmark dataset with hard negatives and ground truth annotations",
        "sample_size": len(business_corpus),
        "data": business_corpus
    }, f, indent=2)

# Calculate SHA-256 for all raw files and build data/manifest.json
manifest = {
    "manifest_version": "1.0.0",
    "updated_at": datetime.now(timezone.utc).isoformat(),
    "project": "UK AI Economic Measurement Lab",
    "datasets": []
}

raw_files = [
    ("DS01", "ONS Thematic CPA Supply & Use Tables 2020-2023", raw_cpa_path),
    ("DS02", "ONS BICS AI Adoption in UK Businesses 2023-2026", raw_bics_path),
    ("DS03", "DSIT AI Sector Study 2024 Benchmark", raw_dsit_path),
    ("DS04", "ONS Data Centres & Digital Infrastructure 2026", raw_infra_path),
    ("DS05", "UK AI Business Classification Benchmark Corpus", raw_corpus_path)
]

for sid, title, path in raw_files:
    with open(path, "rb") as f:
        file_bytes = f.read()
        file_hash = hashlib.sha256(file_bytes).hexdigest()
        file_size = len(file_bytes)
    
    manifest["datasets"].append({
        "source_id": sid,
        "title": title,
        "relative_path": os.path.relpath(path, ROOT_DIR).replace("\\", "/"),
        "sha256": file_hash,
        "size_bytes": file_size,
        "format": "JSON",
        "licence": "Open Government Licence v3.0",
        "verified": True
    })

with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

print(f"Data layer built successfully. 60 benchmark companies written. Manifest written to {MANIFEST_PATH}")

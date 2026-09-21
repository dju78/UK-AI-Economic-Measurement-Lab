"""
Python System of National Accounts (SNA 2008 / ESA 2010) Decision Tree
Matches the TypeScript implementation in packages/methods/sna_tree.ts
"""
from typing import Dict, Any, List, Optional

SNA_DECISION_NODES: Dict[str, Dict[str, Any]] = {
    "root": {
        "id": "root",
        "title": "1. Nature of Transaction or Asset Creation",
        "question": "What is the primary nature of the AI-related expenditure or activity being undertaken by the UK enterprise?",
        "context_help": "SNA 2008 / ESA 2010 requires identifying whether the transaction represents tangible hardware, intangible knowledge assets, intermediate service consumption, or consulting inputs.",
        "options": [
            {
                "id": "opt_hardware",
                "label": "A. Physical Computer Hardware & AI Accelerators",
                "description": "Servers, GPUs, TPUs, networking switches, cooling systems, or data centre equipment.",
                "next_node_id": "hardware_life"
            },
            {
                "id": "opt_model_software",
                "label": "B. Software, Model Weights & Algorithmic Code",
                "description": "Development, training, fine-tuning, or acquisition of AI models, neural networks, or software applications.",
                "next_node_id": "software_mode"
            },
            {
                "id": "opt_cloud_compute",
                "label": "C. Cloud Compute, API Inference Tokens & Hosting",
                "description": "Pay-as-you-go GPU compute hours (e.g. AWS EC2, Azure, Lambda Labs) or model inference API tokens (e.g. OpenAI, Anthropic).",
                "next_node_id": "cloud_residency"
            },
            {
                "id": "opt_consulting",
                "label": "D. External AI Consulting & System Integration",
                "description": "Professional fees paid to third-party consultants for AI strategy, model customization, or deployment assistance.",
                "next_node_id": "consulting_purpose"
            },
            {
                "id": "opt_data_asset",
                "label": "E. Data Acquisition, Labeling & Knowledge Corpora",
                "description": "Purchasing training datasets, human data annotation/labeling services, or creating proprietary domain databases.",
                "next_node_id": "data_asset_life"
            }
        ]
    },

    "hardware_life": {
        "id": "hardware_life",
        "title": "2. Hardware Service Life & Asset Boundary",
        "question": "Is the physical hardware expected to be used repeatedly or continuously in production for more than one year?",
        "context_help": "Assets used for > 1 year enter the SNA Asset Boundary as Gross Fixed Capital Formation (GFCF). Items consumed within a year are treated as intermediate consumption.",
        "options": [
            {
                "id": "hw_gfcf_resident",
                "label": "Yes (> 1 year) — Sourced from UK Supplier",
                "description": "Hardware is capitalized on the UK balance sheet and supplied by a UK resident distributor/manufacturer.",
                "accounting_effect": {
                    "national_accounts_category": "Gross Fixed Capital Formation (GFCF)",
                    "asset_boundary": True,
                    "production_boundary": True,
                    "economic_ownership_uk": True,
                    "residency": "UK Resident",
                    "primary_cpa": "CPA_C262 (Computers & Peripheral Equipment)",
                    "rationale": "Capitalized as tangible fixed asset (computer hardware) under AN.1132. Adds to UK capital stock and domestic demand.",
                    "sna_citation": "SNA 2008 §10.82 / ESA 2010 §3.124"
                }
            },
            {
                "id": "hw_gfcf_import",
                "label": "Yes (> 1 year) — Direct Import from Non-UK Manufacturer",
                "description": "Hardware is shipped directly from overseas (e.g. Taiwan, US) and capitalized by the UK firm.",
                "accounting_effect": {
                    "national_accounts_category": "Imports of Goods",
                    "asset_boundary": True,
                    "production_boundary": True,
                    "economic_ownership_uk": True,
                    "residency": "Rest of World (RoW)",
                    "primary_cpa": "CPA_C262 / CPA_C261",
                    "rationale": "Recorded as UK GFCF financed via Imports of Goods. Increases both domestic capital investment and trade deficit on goods.",
                    "sna_citation": "SNA 2008 §14.88 / ESA 2010 §3.161"
                }
            },
            {
                "id": "hw_intermediate",
                "label": "No (< 1 year) — Minor replacement parts / immediate consumption",
                "description": "Consumable cables, test boards, or components utilized immediately in prototype experiments.",
                "accounting_effect": {
                    "national_accounts_category": "Intermediate Consumption",
                    "asset_boundary": False,
                    "production_boundary": True,
                    "economic_ownership_uk": True,
                    "residency": "UK Resident",
                    "primary_cpa": "CPA_C261",
                    "rationale": "Expensed in the current accounting period as intermediate consumption. Reduces gross value added (GVA) of the acquiring sector.",
                    "sna_citation": "SNA 2008 §6.213"
                }
            }
        ]
    },

    "software_mode": {
        "id": "software_mode",
        "title": "3. Model/Software Development Account",
        "question": "How is the AI software, model weights, or algorithm created or acquired?",
        "context_help": "Own-account software development is capitalized based on production cost (salaries + overheads), whereas purchased licenses depend on ownership transfer.",
        "options": [
            {
                "id": "sw_own_account",
                "label": "A. Own-Account Internal Development (> 1 year utility)",
                "description": "Internal UK engineering teams train proprietary models, develop custom MLOps pipelines, or fine-tune neural nets for internal enterprise use.",
                "accounting_effect": {
                    "national_accounts_category": "Own-Account Intangible Asset",
                    "asset_boundary": True,
                    "production_boundary": True,
                    "economic_ownership_uk": True,
                    "residency": "UK Resident",
                    "primary_cpa": "CPA_J62 (Computer Programming) / CPA_M72 (R&D)",
                    "rationale": "Capitalized as Own-Account Intellectual Property Product (AN.1173 Computer Software / AN.1171 R&D). Output is credited to own-account production and debited to GFCF, directly boosting UK GDP.",
                    "sna_citation": "SNA 2008 §10.137 / ESA 2010 §3.131"
                }
            },
            {
                "id": "sw_purchased_perpetual",
                "label": "B. Purchased Perpetual License / Complete IP Transfer",
                "description": "Outright purchase of model weights and source code giving the UK firm full economic ownership and risk rights.",
                "accounting_effect": {
                    "national_accounts_category": "Gross Fixed Capital Formation (GFCF)",
                    "asset_boundary": True,
                    "production_boundary": True,
                    "economic_ownership_uk": True,
                    "residency": "UK Resident",
                    "primary_cpa": "CPA_J582 (Software Publishing) / CPA_J62",
                    "rationale": "Treated as purchased intellectual property fixed asset (GFCF). If vendor is foreign, recorded as an Import of Computer Services with simultaneous capital formation.",
                    "sna_citation": "SNA 2008 §10.141"
                }
            },
            {
                "id": "sw_saas_subscription",
                "label": "C. Periodic SaaS Subscription / API Access Fee",
                "description": "Monthly/annual fee to access a proprietary model hosted on the vendor’s infrastructure without transferring the underlying asset.",
                "accounting_effect": {
                    "national_accounts_category": "Intermediate Consumption",
                    "asset_boundary": False,
                    "production_boundary": True,
                    "economic_ownership_uk": False,
                    "residency": "UK Resident",
                    "primary_cpa": "CPA_J63 (Information Services) / CPA_J582",
                    "rationale": "Licence to use / cloud service. No asset is acquired on the UK balance sheet; fee is expensed as intermediate consumption of services.",
                    "sna_citation": "SNA 2008 §10.143 / ONS S1 §4"
                }
            }
        ]
    },

    "cloud_residency": {
        "id": "cloud_residency",
        "title": "4. Cloud Compute & API Supplier Residency",
        "question": "Where is the cloud compute infrastructure or inference API provider resident and economically based?",
        "context_help": "Cross-border cloud services represent imports of digital services. Domestic cloud infrastructure contributes to domestic output.",
        "options": [
            {
                "id": "cloud_foreign_import",
                "label": "A. Non-UK Resident Provider (e.g. US Hyperscaler API billing overseas)",
                "description": "API tokens or compute instances billed by a foreign entity (e.g. OpenAI US, AWS US entity).",
                "accounting_effect": {
                    "national_accounts_category": "Imports of Services",
                    "asset_boundary": False,
                    "production_boundary": True,
                    "economic_ownership_uk": False,
                    "residency": "Rest of World (RoW)",
                    "primary_cpa": "CPA_J63 (Hosting & Data Processing Services)",
                    "rationale": "Recorded as Intermediate Consumption of the UK firm and an Import of Information Services (Trade in Services). Worsens UK services trade balance.",
                    "sna_citation": "SNA 2008 §14.88 / ONS Digital Trade S6"
                }
            },
            {
                "id": "cloud_uk_resident",
                "label": "B. UK-Resident Cloud Datacentre Provider",
                "description": "Billed and hosted by a UK resident entity (e.g. UK datacentre operator or UK-resident subsidiary).",
                "accounting_effect": {
                    "national_accounts_category": "Intermediate Consumption",
                    "asset_boundary": False,
                    "production_boundary": True,
                    "economic_ownership_uk": True,
                    "residency": "UK Resident",
                    "primary_cpa": "CPA_J63 (Data Processing & Hosting)",
                    "rationale": "Domestic transaction: Domestic intermediate consumption for the user, domestic output for the UK cloud sector. GDP impact is neutral at basic prices until value addition occurs.",
                    "sna_citation": "SNA 2008 §6.215"
                }
            }
        ]
    },

    "consulting_purpose": {
        "id": "consulting_purpose",
        "title": "5. AI Consulting Output Character",
        "question": "Does the consulting work directly contribute to the creation of a durable custom intellectual property asset owned by the client?",
        "context_help": "Consulting fees that directly result in the formation of a capitalizable software asset can be capitalized under GFCF; general strategic advice is intermediate consumption.",
        "options": [
            {
                "id": "cons_asset_capitalized",
                "label": "Yes — Consulting builds bespoke proprietary model/system (> 1 yr)",
                "description": "Consultant contractors develop custom software components that are integrated into the client’s capital assets.",
                "accounting_effect": {
                    "national_accounts_category": "Gross Fixed Capital Formation (GFCF)",
                    "asset_boundary": True,
                    "production_boundary": True,
                    "economic_ownership_uk": True,
                    "residency": "UK Resident",
                    "primary_cpa": "CPA_J62 (Computer Programming & Consultancy)",
                    "rationale": "Capitalized as part of the asset value of software and databases (AN.1173).",
                    "sna_citation": "SNA 2008 §10.137"
                }
            },
            {
                "id": "cons_general_expense",
                "label": "No — General AI readiness, vendor audit, or staff training",
                "description": "Advisory services, organizational change workshops, or general compliance evaluations.",
                "accounting_effect": {
                    "national_accounts_category": "Intermediate Consumption",
                    "asset_boundary": False,
                    "production_boundary": True,
                    "economic_ownership_uk": True,
                    "residency": "UK Resident",
                    "primary_cpa": "CPA_M702 (Management Consultancy)",
                    "rationale": "Treated as ordinary operating intermediate consumption of business services.",
                    "sna_citation": "SNA 2008 §6.215"
                }
            }
        ]
    },

    "data_asset_life": {
        "id": "data_asset_life",
        "title": "6. Training Data & Knowledge Corpora Capitalization",
        "question": "Is the acquired or labeled dataset intended for multi-year iterative model training and proprietary database usage?",
        "context_help": "Databases meeting SNA criteria (structured data organized for query/retrieval for > 1 year) qualify as GFCF in databases.",
        "options": [
            {
                "id": "data_database_gfcf",
                "label": "Yes — Proprietary training database / vector knowledge store (> 1 yr)",
                "description": "Curated corpus and embedding database maintained for continuous fine-tuning and model retraining.",
                "accounting_effect": {
                    "national_accounts_category": "Gross Fixed Capital Formation (GFCF)",
                    "asset_boundary": True,
                    "production_boundary": True,
                    "economic_ownership_uk": True,
                    "residency": "UK Resident",
                    "primary_cpa": "CPA_J63 / CPA_M72",
                    "rationale": "Capitalized under AN.1173 (Databases). Represents an intangible fixed asset yielding future economic benefits.",
                    "sna_citation": "SNA 2008 §10.144"
                }
            },
            {
                "id": "data_one_off_expense",
                "label": "No — One-off data labeling / ephemeral testing dataset",
                "description": "Batch data annotation used for a single experiment and discarded.",
                "accounting_effect": {
                    "national_accounts_category": "Intermediate Consumption",
                    "asset_boundary": False,
                    "production_boundary": True,
                    "economic_ownership_uk": True,
                    "residency": "UK Resident",
                    "primary_cpa": "CPA_J63 (Data Processing)",
                    "rationale": "Expensed as intermediate consumption of data processing services in the current period.",
                    "sna_citation": "SNA 2008 §6.213"
                }
            }
        ]
    }
}

SNA_CASE_STUDIES = [
    {
        "id": "CS01",
        "title": "UK Bank Fine-tunes Open Weights Model on Cloud GPU Cluster",
        "firm_type": "Large Financial Institution (SIC 64)",
        "activity_summary": "A London investment bank downloads Llama-3 open weights, hires internal ML engineers, and spends £2.5m on cloud compute to fine-tune a credit-risk underwriting system used over 3 years.",
        "initial_answers": {"root": "opt_model_software", "software_mode": "sw_own_account"},
        "expected_treatment": "Own-Account Software Asset (GFCF AN.1173) + Cloud Intermediate Consumption",
        "key_national_accounts_insight": "The internal engineering labour is capitalized as own-account GFCF (boosting GDP), while the cloud compute rented during training is treated as intermediate consumption."
    },
    {
        "id": "CS02",
        "title": "NHS Foundation Trust Subscribes to US AI Diagnostic SaaS",
        "firm_type": "Public Healthcare Provider (SIC 86)",
        "activity_summary": "An NHS hospital trust signs a £500k/year contract to access an FDA-approved radiology chest X-ray AI tool hosted in US cloud datacentres.",
        "initial_answers": {"root": "opt_cloud_compute", "cloud_residency": "cloud_foreign_import"},
        "expected_treatment": "Government Intermediate Consumption + Import of Information Services (CPA_J63)",
        "key_national_accounts_insight": "No asset is formed on the UK balance sheet. The transaction is an import of services from the US, entering government intermediate consumption and reducing net trade."
    },
    {
        "id": "CS03",
        "title": "Cambridge Robotics Lab Imports £5M GPU Supercomputer",
        "firm_type": "Autonomous Systems Manufacturer (SIC 28.99)",
        "activity_summary": "A robotics firm purchases high-density Nvidia H100 GPU server racks from a Taiwanese manufacturer to support a 5-year embodied AI robotics program.",
        "initial_answers": {"root": "opt_hardware", "hardware_life": "hw_gfcf_import"},
        "expected_treatment": "Gross Fixed Capital Formation (AN.1132 Computer Hardware) + Imports of Goods",
        "key_national_accounts_insight": "Physical computer hardware is capitalized as GFCF on the UK balance sheet, financed by an import of manufactured goods under CPA_C262."
    },
    {
        "id": "CS04",
        "title": "London Law Firm Hires AI Consultancy for Bespoke Workflow Tool",
        "firm_type": "Legal Services Partnership (SIC 69.1)",
        "activity_summary": "A law firm pays £800k to a UK AI engineering boutique to build a custom M&A contract clause extraction tool whose code is owned permanently by the firm.",
        "initial_answers": {"root": "opt_consulting", "consulting_purpose": "cons_asset_capitalized"},
        "expected_treatment": "Purchased Intellectual Property Fixed Asset (GFCF AN.1173 in CPA_J62)",
        "key_national_accounts_insight": "Because the firm acquires full economic ownership of software used for > 1 year, the consulting expenditure is classified as GFCF rather than intermediate consumption."
    },
    {
        "id": "CS05",
        "title": "Manchester Retailer Licenses Off-the-Shelf Generative AI Copy Tool",
        "firm_type": "E-commerce Retailer (SIC 47)",
        "activity_summary": "A retail firm pays £50/month per seat for an AI copywriting SaaS tool with no customization and standard monthly cancellation terms.",
        "initial_answers": {"root": "opt_model_software", "software_mode": "sw_saas_subscription"},
        "expected_treatment": "Intermediate Consumption of Information Services (CPA_J582 / CPA_J63)",
        "key_national_accounts_insight": "Standard short-term software subscriptions are operating expenses (intermediate consumption) and do not enter the SNA asset boundary."
    },
    {
        "id": "CS06",
        "title": "Oxford Biotech Creates Proprietary Molecular Embedding Database",
        "firm_type": "Biotechnology R&D Lab (SIC 72.11)",
        "activity_summary": "Biotech researchers synthesize experimental protein assays and build a proprietary 10-million molecule embedding database used across multiple drug discovery pipelines.",
        "initial_answers": {"root": "opt_data_asset", "data_asset_life": "data_database_gfcf"},
        "expected_treatment": "Gross Fixed Capital Formation in Databases & R&D (AN.1173 / AN.1171)",
        "key_national_accounts_insight": "Databases structured for repeated retrieval and query over multiple years qualify as intangible fixed capital formation under National Accounts rules."
    }
]

def resolve_sna_decision_path(answers: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """Traverse the SNA decision tree given a dict of node_id -> option_id"""
    curr_node_id = "root"
    while curr_node_id in SNA_DECISION_NODES:
        node = SNA_DECISION_NODES[curr_node_id]
        chosen_opt_id = answers.get(curr_node_id)
        if not chosen_opt_id:
            return None
        
        option = next((opt for opt in node["options"] if opt["id"] == chosen_opt_id), None)
        if not option:
            return None
        
        if "accounting_effect" in option:
            return option["accounting_effect"]
        
        if "next_node_id" in option:
            curr_node_id = option["next_node_id"]
        else:
            return None
    return None

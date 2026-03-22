#!/usr/bin/env python3
import pdfplumber
import json
import re
from pathlib import Path
from collections import defaultdict

pdf_files = [
    "UPVC LIST 22.1.26.pdf",
    "Techno New Price List (15.01.2026).pdf",
    "SWR PIPE 1.1.26.pdf",
    "SWR NANY TRAP 1.1.26.pdf",
    "SANT-RPL-11-01-26.pdf",
    "PVC PIPE 1.1.26.pdf",
    "PVC FITTING 22.1.26.pdf",
    "PPR LIST 22.1.26.pdf",
    "JINDAL LIST 09-01-2026.pdf",
    "ITM Combined Price List 1.1 (1).pdf",
    "FREEMANS-DLP-Catalogue-Dec2025.pdf",
    "CPVC SMART PLUS 22.1.26.pdf",
    "Castle Valves Price List. 150.pdf"
]

def get_category(filename):
    f = filename.lower()
    if "upvc" in f: return "UPVC Pipes"
    elif "pvc pipe" in f: return "PVC Pipes"
    elif "pvc fitting" in f: return "PVC Fittings"
    elif "swr pipe" in f: return "SWR Pipes"
    elif "swr" in f and "trap" in f: return "SWR Traps"
    elif "ppr" in f: return "PPR Pipes"
    elif "cpvc" in f: return "CPVC Pipes"
    elif "valve" in f: return "Valves"
    elif "jindal" in f: return "Jindal Products"
    elif "sant" in f: return "Sant Products"
    elif "freemans" in f: return "Freemans Products"
    elif "itm" in f: return "ITM Products"
    elif "techno" in f: return "Techno Products"
    return "General Hardware"

def extract_price(text):
    if not text:
        return None
    text = str(text)
    matches = re.findall(r'[\d,]+\.?\d*', text)
    for match in matches:
        try:
            price = float(match.replace(',', ''))
            if price > 0:
                return price
        except:
            pass
    return None

def process_pdf(filepath):
    products = []
    try:
        with pdfplumber.open(filepath) as pdf:
            for page in pdf.pages:
                # Try to extract tables
                tables = page.extract_tables()
                if tables:
                    for table in tables:
                        for row in table:
                            try:
                                row_str = ' '.join([str(c) if c else '' for c in row])
                                if any(kw in row_str.upper() for kw in ['PIPE', 'FITTING', 'VALVE', 'TRAP', 'SIZE', 'MM']):
                                    product_name = None
                                    price = None
                                    specs = None
                                    
                                    for idx, cell in enumerate(row):
                                        if cell:
                                            cell_str = str(cell)
                                            if product_name is None and len(cell_str) > 2:
                                                product_name = cell_str.strip()
                                            if price is None:
                                                p = extract_price(cell_str)
                                                if p:
                                                    price = p
                                            if specs is None and any(s in cell_str.upper() for s in ['MM', 'INCH', 'SIZE']):
                                                specs = cell_str.strip()
                                    
                                    if product_name and price:
                                        products.append({
                                            'name': product_name[:100],
                                            'price': round(price, 2),
                                            'specs': (specs or 'Not specified')[:100]
                                        })
                            except Exception as e:
                                continue
    except Exception as e:
        pass
    
    return products

# Main extraction
results = defaultdict(lambda: {'products': []})

for pdf_file in pdf_files:
    filepath = Path(pdf_file)
    if filepath.exists():
        category = get_category(pdf_file)
        products = process_pdf(str(filepath))
        results[category]['products'].extend(products)
        print(f"✓ {pdf_file} - {len(products)} products")
    else:
        print(f"✗ {pdf_file} - Not found")

# Convert to regular dict
output = {k: v for k, v in sorted(results.items())}

# Output JSON
print("\n" + json.dumps(output, indent=2, ensure_ascii=False))

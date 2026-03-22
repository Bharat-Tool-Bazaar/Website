#!/usr/bin/env python3
import PyPDF2
import re
import json
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
    categories = {
        "upvc": "UPVC Pipes",
        "pvc pipe": "PVC Pipes",
        "pvc fitting": "PVC Fittings",
        "swr pipe": "SWR Pipes",
        "swr trap": "SWR Traps",
        "ppr": "PPR Pipes",
        "cpvc": "CPVC Pipes",
        "valve": "Valves",
        "jindal": "Jindal Products",
        "sant": "Sant Products",
        "freemans": "Freemans Products",
        "itm": "ITM Products",
        "techno": "Techno Products"
    }
    for key, cat in categories.items():
        if key in f:
            return cat
    return "General Hardware"

def extract_price(text):
    if not text:
        return None
    text = str(text)
    matches = re.findall(r'[\d,]+\.?\d*', text)
    for match in matches:
        try:
            price = float(match.replace(',', ''))
            if 10 < price < 100000:  # Reasonable price range
                return price
        except:
            pass
    return None

def process_pdf(filepath):
    products = []
    try:
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                try:
                    text += page.extract_text() + "\n"
                except:
                    pass
        
        # Parse text line by line
        lines = text.split('\n')
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            i += 1
            
            # Skip empty lines
            if not line or len(line) < 3:
                continue
            
            # Check if line contains product keywords
            has_product_keyword = any(kw in line.upper() for kw in ['PIPE', 'FITTING', 'VALVE', 'TRAP', 'TEE', 'ELBOW', 'BEND', 'COUPLER', 'ADAPTER'])
            
            if has_product_keyword or (len(line) > 5 and not line.startswith('Page')):
                product_name = line[:100]
                price = None
                specs = None
                
                # Check next few lines for price and specs
                for j in range(i, min(i + 5, len(lines))):
                    next_line = lines[j].strip()
                    
                    # Extract price
                    if not price and (any(c.isdigit() for c in next_line)):
                        p = extract_price(next_line)
                        if p:
                            price = p
                    
                    # Extract specs
                    if not specs and any(s in next_line.upper() for s in ['MM', 'INCH', 'SIZE', 'X']):
                        specs = next_line[:80]
                        break
                
                # If we found a price, add the product
                if price and product_name != "":
                    products.append({
                        'name': product_name,
                        'price': round(price, 2),
                        'specs': specs or 'Not specified'
                    })
    
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        pass
    
    return products

# Main extraction
results = defaultdict(lambda: {'products': []})

for pdf_file in pdf_files:
    filepath = Path(pdf_file)
    if filepath.exists():
        category = get_category(pdf_file)
        products = process_pdf(str(filepath))
        # Remove duplicates
        unique_products = {(p['name'], p['price']): p for p in products}.values()
        results[category]['products'].extend(list(unique_products))
        print(f"✓ {pdf_file} - {len(list(unique_products))} products")
    else:
        print(f"✗ {pdf_file} not found")

# Sort results
output = {}
for key in sorted(results.keys()):
    products = sorted(results[key]['products'], key=lambda x: x['price'])
    output[key] = {'products': products}

# Output JSON
print("\n")
print(json.dumps(output, indent=2, ensure_ascii=False))

# Save to file
with open('products_data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

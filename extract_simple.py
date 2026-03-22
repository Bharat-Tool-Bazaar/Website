#!/usr/bin/env python3
"""
Simplified PDF product extraction - processes one file at a time
"""
import subprocess
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

def extract_numbers(text):
    """Extract all numbers from text"""
    matches = re.findall(r'[\d,]+\.?\d*', text)
    return matches

def parse_pdf_with_pypdf(filepath):
    """Use PyPDF2 to extract text"""
    try:
        import PyPDF2
        products = []
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            all_text = ""
            for page in reader.pages:
                try:
                    all_text += page.extract_text() + "\n"
                except:
                    pass
        
        # Parse extracted text
        lines = all_text.split('\n')
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Look for product pattern: name + price
            if not line or len(line) < 3:
                continue
            
            # Heuristic: lines with product keywords
            is_product = any(kw in line.upper() for kw in ['PIPE', 'FITTING', 'VALVE', 'TRAP', 'TEE', 'ELBOW', 'COUPLER', 'ADAPTER', 'BEND', 'JOINT'])
            
            if is_product or (3 < len(line) < 150):
                name = line[:100]
                price = None
                specs = None
                
                # Find price in current or next lines
                for j in range(i, min(i + 4, len(lines))):
                    text_part = lines[j].strip()
                    numbers = extract_numbers(text_part)
                    for num in numbers:
                        try:
                            val = float(num.replace(',', ''))
                            if 5 < val < 50000:
                                price = val
                                break
                        except:
                            pass
                    
                    # Check for specs
                    if not specs and any(s in text_part.upper() for s in ['MM', 'INCH', 'SIZE']):
                        specs = text_part[:80]
                
                if price:
                    products.append({
                        'name': name,
                        'price': round(price, 2),
                        'specs': specs or 'Not specified'
                    })
        
        return products
    except Exception as e:
        print(f"Error: {e}", flush=True)
        return []

# Main
results = defaultdict(lambda: {'products': []})

for i, pdf_file in enumerate(pdf_files, 1):
    filepath = Path(pdf_file)
    if filepath.exists():
        print(f"[{i}/13] Processing {pdf_file}...", flush=True)
        category = get_category(pdf_file)
        products = parse_pdf_with_pypdf(str(filepath))
        
        # Remove duplicates
        seen = set()
        unique = []
        for p in products:
            key = (p['name'], p['price'])
            if key not in seen:
                seen.add(key)
                unique.append(p)
        
        results[category]['products'].extend(unique)
        print(f"  ✓ Found {len(unique)} unique products", flush=True)

# Output
output = {k: v for k, v in sorted(results.items())}

# Print JSON
json_str = json.dumps(output, indent=2, ensure_ascii=False)
print("\n" + json_str, flush=True)

# Save file
with open('products_data.json', 'w', encoding='utf-8') as f:
    f.write(json_str)
    
print("\nSaved to products_data.json", flush=True)

import pdfplumber
import json
import re
from pathlib import Path
from collections import defaultdict

# PDF files to process
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

products_by_category = defaultdict(lambda: {"products": []})

def infer_category(filename):
    """Infer product category from filename"""
    filename_lower = filename.lower()
    
    if "upvc" in filename_lower:
        return "UPVC Pipes"
    elif "pvc pipe" in filename_lower:
        return "PVC Pipes"
    elif "pvc fitting" in filename_lower:
        return "PVC Fittings"
    elif "swr pipe" in filename_lower:
        return "SWR Pipes"
    elif "swr" in filename_lower and "trap" in filename_lower:
        return "SWR Traps"
    elif "ppr" in filename_lower:
        return "PPR Pipes"
    elif "cpvc" in filename_lower:
        return "CPVC Pipes"
    elif "valve" in filename_lower:
        return "Valves"
    elif "jindal" in filename_lower:
        return "Jindal Products"
    elif "sant" in filename_lower:
        return "Sant Products"
    elif "techno" in filename_lower:
        return "Techno Products"
    elif "itm" in filename_lower:
        return "ITM Products"
    elif "freemans" in filename_lower:
        return "Freemans Products"
    else:
        return "General Hardware"

def extract_price(text):
    """Extract price from text"""
    # Match currency patterns like Rs., ₹, price:, cost:
    patterns = [
        r'[\d,]+\.?\d*\s*(?:Rs|₹|INR)?',
        r'(?:Rs|₹|INR)\s*[\d,]+\.?\d*',
        r'[\d,]+\.?\d*'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            price_str = match.group(0).replace(',', '').replace('Rs', '').replace('₹', '').replace('INR', '').strip()
            try:
                return float(price_str)
            except:
                pass
    return None

def extract_from_pdf(filepath):
    """Extract product data from PDF"""
    products = []
    
    try:
        with pdfplumber.open(filepath) as pdf:
            # Extract text from all pages
            full_text = ""
            tables_data = []
            
            for page_num, page in enumerate(pdf.pages):
                # Extract text
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
                
                # Extract tables
                tables = page.extract_tables()
                if tables:
                    for table in tables:
                        tables_data.append(table)
            
            # Parse tables if available
            if tables_data:
                products.extend(parse_tables(tables_data))
            
            # Parse text content using regex and heuristics
            if not tables_data:  # If no tables, rely on text parsing
                products.extend(parse_text_content(full_text))
        
        return products
    
    except Exception as e:
        print(f"Error reading {filepath}: {str(e)}")
        return []

def parse_tables(tables):
    """Parse product data from tables"""
    products = []
    
    for table in tables:
        for row in table:
            if not row or len(row) == 0:
                continue
            
            # Try to find product name and price in row
            row_text = ' '.join(str(cell) if cell else '' for cell in row)
            
            if any(keyword in row_text.upper() for keyword in ['PIPE', 'FITTING', 'VALVE', 'TRAP', 'ELBOW', 'TEE', 'BEND']):
                product_name = None
                price = None
                specs = None
                
                # Extract product name (usually first or second column)
                for cell in row:
                    if cell and len(str(cell)) > 3 and any(keyword in str(cell).upper() for keyword in ['PIPE', 'FITTING', 'VALVE', 'TRAP']):
                        product_name = str(cell).strip()
                        break
                
                # Look for price in any cell
                for cell in row:
                    if cell:
                        price = extract_price(str(cell))
                        if price:
                            break
                
                # Extract specifications (size, material, etc.)
                for cell in row:
                    if cell and ('MM' in str(cell).upper() or 'INCH' in str(cell).upper() or 'SIZE' in str(cell).upper()):
                        specs = str(cell).strip()
                        break
                
                if product_name and price:
                    products.append({
                        'name': product_name,
                        'price': price,
                        'specs': specs or 'Not specified'
                    })
    
    return products

def parse_text_content(text):
    """Parse product data from text content"""
    products = []
    
    # Split into lines and process
    lines = text.split('\n')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Look for lines that contain product indicators
        if any(keyword in line.upper() for keyword in ['PIPE', 'FITTING', 'VALVE', 'TRAP', 'ELBOW', 'TEE', 'BEND']):
            product_info = {
                'name': line,
                'price': None,
                'specs': None
            }
            
            # Check next lines for price and specs
            for j in range(1, min(3, len(lines) - i)):
                next_line = lines[i + j].strip()
                
                # Extract price
                if not product_info['price']:
                    price = extract_price(next_line)
                    if price:
                        product_info['price'] = price
                
                # Extract specs
                if not product_info['specs'] and ('MM' in next_line.upper() or 'INCH' in next_line.upper() or 'SIZE' in next_line.upper()):
                    product_info['specs'] = next_line
            
            if product_info['price']:
                if not product_info['specs']:
                    product_info['specs'] = 'Not specified'
                products.append(product_info)
        
        i += 1
    
    return products

# Process all PDFs
for pdf_file in pdf_files:
    filepath = Path(pdf_file)
    
    if filepath.exists():
        print(f"Processing: {pdf_file}")
        category = infer_category(pdf_file)
        products = extract_from_pdf(str(filepath))
        
        for product in products:
            if product['price']:  # Only add products with valid prices
                products_by_category[category]['products'].append(product)
    else:
        print(f"File not found: {pdf_file}")

# Convert to regular dict and sort
result = {}
for category in sorted(products_by_category.keys()):
    result[category] = products_by_category[category]

# Output JSON
print("\n" + "="*80)
print("EXTRACTED PRODUCT DATA")
print("="*80 + "\n")
print(json.dumps(result, indent=2, ensure_ascii=False))

# Also save to file
with open('products_data.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)
print("\n\nData saved to products_data.json")

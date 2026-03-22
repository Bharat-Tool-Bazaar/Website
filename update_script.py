#!/usr/bin/env python3
import json
import re

# Read the extracted products data
with open('products_data.json', 'r', encoding='utf-8') as f:
    products_data = json.load(f)

# Read the current script.js
with open('script.js', 'r', encoding='utf-8') as f:
    script_content = f.read()

# Create the new productsData JavaScript object
# We'll embed the JSON directly as a JavaScript variable
products_json_str = json.dumps(products_data, indent=2)
new_products_var = f"const productsData = {products_json_str};"

# Find and replace the old productsData definition
# Pattern: from "const productsData = {" to the closing "};" at the end of the object
# This is complex, so we'll use a more sophisticated approach

# Find the start of productsData
start_pattern = r'const productsData = \{'
start_match = re.search(start_pattern, script_content)

if start_match:
    # Find the closing brace of this object
    # Start from the opening brace and find the matching closing brace
    start_pos = start_match.start()
    brace_count = 0
    in_string = False
    escape_next = False
    end_pos = start_match.end() - 1  # Position of the opening brace
    
    for i in range(start_match.end() - 1, len(script_content)):
        char = script_content[i]
        
        if escape_next:
            escape_next = False
            continue
        
        if char == '\\':
            escape_next = True
            continue
        
        if char == '"' and not escape_next:
            in_string = not in_string
            continue
        
        if not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    end_pos = i + 1
                    break
    
    # Find the semicolon after the closing brace
    if end_pos < len(script_content) and script_content[end_pos] == ';':
        end_pos += 1
    
    # Replace the old productsData with the new one
    before = script_content[:start_pos]
    after = script_content[end_pos:]
    
    new_content = before + new_products_var + after
    
    # Write back to script.js
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Successfully updated script.js")
    print(f"  - Replaced old productsData object")
    print(f"  - New file size: {len(new_content)} bytes")
    
    # Count products
    total_products = sum(len(cat.get('products', [])) for cat in products_data.values())
    print(f"  - Total products: {total_products}")
    
else:
    print("✗ Could not find productsData definition in script.js")
    exit(1)

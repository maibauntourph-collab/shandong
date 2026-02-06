
def check_brackets(filename):
    stack = []
    brackets = {'(': ')', '{': '}', '[': ']'}
    
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for line_num, line in enumerate(lines, 1):
        for char_num, char in enumerate(line, 1):
            if char in brackets.keys():
                stack.append((char, line_num, char_num))
            elif char in brackets.values():
                if not stack:
                    print(f"Error: Unmatched closing bracket '{char}' at line {line_num}, col {char_num}")
                    return
                
                last_open, last_line, last_col = stack.pop()
                expected_close = brackets[last_open]
                
                if char != expected_close:
                    print(f"Error: Mismatched bracket at line {line_num}, col {char_num}. Found '{char}', expected '{expected_close}' (opened at line {last_line}, col {last_col})")
                    return

    if stack:
        last_open, last_line, last_col = stack[-1]
        print(f"Error: Unclosed bracket '{last_open}' at line {last_line}, col {last_col}")
    else:
        print("No bracket errors found.")

check_brackets("c:/projects/out_catering/client/src/data/menuData.ts")

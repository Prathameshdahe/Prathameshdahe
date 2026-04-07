import random

width = 600
height = 150
cols = 42
rows = 7
square_size = 12
gap = 2

# Colors from GitHub dark mode
colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']

svg_parts = []
svg_parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">')
svg_parts.append('<defs>')
svg_parts.append('''
<style>
    .bg { fill: #0d1117; }
    .text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 500; fill: #c9d1d9; }
    .text-title { font-weight: bold; }
    .bubble { fill: #30363d; stroke: #8b949e; stroke-width: 1px; rx: 4px; }
    
    .pika {
        animation: pikaMove 16s infinite;
        transform-origin: center bottom;
    }
    
    @keyframes pikaMove {
        0% { transform: translate(-50px, 60px) scaleX(1); }
        10% { transform: translate(150px, 30px) scaleX(1); }
        15% { transform: translate(200px, 60px) scaleX(1); }
        25% { transform: translate(350px, 60px) scaleX(1); }
        35% { transform: translate(450px, 40px) scaleX(1); }
        45% { transform: translate(550px, 60px) scaleX(1); }
        50% { transform: translate(550px, 60px) scaleX(-1); }
        60% { transform: translate(350px, 30px) scaleX(-1); }
        70% { transform: translate(250px, 60px) scaleX(-1); }
        80% { transform: translate(100px, 60px) scaleX(-1); }
        85% { transform: translate(50px, 30px) scaleX(-1); }
        100% { transform: translate(-50px, 60px) scaleX(1); }
    }
    
    .msg1, .msg2 { opacity: 0; animation-duration: 16s; animation-iteration-count: infinite; }
    
    .msg1 { animation-name: showMsg1; }
    @keyframes showMsg1 {
        0%, 20% { opacity: 0; }
        25%, 40% { opacity: 1; transform: translateY(-5px); }
        45%, 100% { opacity: 0; }
    }
    
    .msg2 { animation-name: showMsg2; }
    @keyframes showMsg2 {
        0%, 70% { opacity: 0; }
        75%, 90% { opacity: 1; transform: translateY(-5px); }
        95%, 100% { opacity: 0; }
    }
    
    .commit-pulse { animation: pulse 2s infinite alternate; }
    @keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 1; } }
</style>
''')
svg_parts.append('</defs>')

# Background
svg_parts.append('<rect width="100%" height="100%" class="bg" rx="6" />')

# Draw Contribution Grid
grid_x_offset = 10
grid_y_offset = 25
svg_parts.append(f'<g transform="translate({grid_x_offset}, {grid_y_offset})">')
for x in range(cols):
    for y in range(rows):
        rand = random.random()
        if rand > 0.95: c = colors[4]
        elif rand > 0.85: c = colors[3]
        elif rand > 0.7: c = colors[2]
        elif rand > 0.5: c = colors[1]
        else: c = colors[0]
        
        pulse_class = ' class="commit-pulse"' if rand > 0.9 else ''
        svg_parts.append(f'<rect width="{square_size}" height="{square_size}" x="{x*(square_size+gap)}" y="{y*(square_size+gap)}" fill="{c}" rx="2"{pulse_class} />')
svg_parts.append('</g>')

# Label
svg_parts.append('<text x="10" y="16" class="text"><tspan class="text-title">Prathamesh\'s</tspan> Contributions</text>')

# Pikachu Pixel Art (16x16)
pikachu_pixels = [
    "0020000000000200",
    "0022000000002200",
    "0012211111122100",
    "0111111111111110",
    "0111111111111110",
    "0112111111112110",
    "0112111111112110",
    "0111112222111110",
    "3311111111111133",
    "3311111111111133",
    "0111111111111110",
    "0011111111111104",
    "0001111111111044",
    "0000111111110040",
    "0001110000111000",
    "0011110000111100"
]

cmap = {
    '1': '#FADB14', # Yellow
    '2': '#000000', # Black
    '3': '#FF4D4F', # Red
    '4': '#D48806'  # Dark Yellow/Brown
}

pixel_size = 3
pika_w = 16 * pixel_size
pika_h = 16 * pixel_size

svg_parts.append('<g class="pika">')

# Draw Pikachu
svg_parts.append(f'<g transform="translate(0, 0)">')
for y, row in enumerate(pikachu_pixels):
    for x, char in enumerate(row):
        if char in cmap:
            svg_parts.append(f'<rect x="{x*pixel_size}" y="{y*pixel_size}" width="{pixel_size}" height="{pixel_size}" fill="{cmap[char]}" />')

# Draw Messages attached to Pikachu
svg_parts.append('<g class="msg1" transform="translate(40, -30)">')
svg_parts.append('<rect width="180" height="24" class="bubble" />')
svg_parts.append('<text x="10" y="16" class="text">⚡ Pikachu learned Python!</text>')
svg_parts.append('</g>')

svg_parts.append('<g class="msg2" transform="translate(40, -30)">')
svg_parts.append('<rect width="210" height="24" class="bubble" />')
svg_parts.append('<text x="10" y="16" class="text">🦉 Night Owl Mode Activated</text>')
svg_parts.append('</g>')

svg_parts.append('</g>') # End Pikachu group
svg_parts.append('</g>') # End Animation group

svg_parts.append('</svg>')

with open('pikachu.svg', 'w', encoding='utf-8') as f:
    f.write('\n'.join(svg_parts))

print("Created pikachu.svg successfully!")

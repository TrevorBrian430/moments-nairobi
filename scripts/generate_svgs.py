import zlib
import struct
import os

with open('public/images/logo.png', 'rb') as f:
    data = f.read()

pos = 8
idat = b''
while pos < len(data):
    l, t = struct.unpack('>I4s', data[pos:pos+8])
    pos += 8
    cd = data[pos:pos+l]
    pos += l + 4
    if t == b'IHDR':
        w, h, bd, ct = struct.unpack('>IIBB', cd[:10])
    elif t == b'IDAT':
        idat += cd

raw = zlib.decompress(idat)
stride = w * 4
prev = bytearray(stride)
out = bytearray(h * stride)
sp = dp = 0
for y in range(h):
    ft = raw[sp]
    sp += 1
    curr = bytearray(raw[sp:sp+stride])
    sp += stride
    if ft == 1:
        for x in range(4, stride):
            curr[x] = (curr[x] + curr[x-4]) & 0xFF
    elif ft == 2:
        for x in range(stride):
            curr[x] = (curr[x] + prev[x]) & 0xFF
    elif ft == 3:
        for x in range(stride):
            left = curr[x-4] if x >= 4 else 0
            curr[x] = (curr[x] + ((left + prev[x]) >> 1)) & 0xFF
    elif ft == 4:
        for x in range(stride):
            a = curr[x-4] if x >= 4 else 0
            b = prev[x]
            c = prev[x-4] if x >= 4 else 0
            p = a + b - c
            pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
            pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
            curr[x] = (curr[x] + pr) & 0xFF
    prev = curr
    out[dp:dp+stride] = curr
    dp += stride

pixels = bytes(out)

# Binary image
grid = [[0]*(w+2) for _ in range(h+2)]
for y in range(h):
    for x in range(w):
        idx = (y * w + x) * 4
        r, g, b, a = pixels[idx:idx+4]
        # Mauve color: r ~ 187, g ~ 76, b ~ 108
        if r < 210 and g < 180:
            grid[y+1][x+1] = 1

def rdp(points, epsilon=0.75):
    if len(points) < 3:
        return points
    x1, y1 = points[0]
    x2, y2 = points[-1]
    dx = x2 - x1
    dy = y2 - y1
    dist_sq = dx*dx + dy*dy
    max_d = 0
    idx = 0
    for i in range(1, len(points)-1):
        x0, y0 = points[i]
        if dist_sq == 0:
            d = (x0 - x1)**2 + (y0 - y1)**2
        else:
            d = abs(dy*x0 - dx*y0 + x2*y1 - y2*x1)**2 / dist_sq
        if d > max_d:
            max_d = d
            idx = i
    if max_d > epsilon * epsilon:
        left = rdp(points[:idx+1], epsilon)
        right = rdp(points[idx:], epsilon)
        return left[:-1] + right
    else:
        return [points[0], points[-1]]

dirs = [(1,0), (1,1), (0,1), (-1,1), (-1,0), (-1,-1), (0,-1), (1,-1)]
visited = set()
polygons = []

for y in range(1, h+1):
    for x in range(1, w+1):
        if grid[y][x] == 1 and (grid[y][x-1] == 0 or grid[y][x+1] == 0 or grid[y-1][x] == 0 or grid[y+1][x] == 0):
            edge = (x, y)
            if edge in visited:
                continue
            poly = [(x-1, y-1)]
            curr = (x, y)
            bd = 4
            found_start = False
            start_pt = curr
            for i in range(8):
                nx, ny = curr[0] + dirs[i][0], curr[1] + dirs[i][1]
                if grid[ny][nx] == 0:
                    bd = i
                    found_start = True
                    break
            if not found_start:
                continue
            d = (bd + 1) % 8
            steps = 0
            while steps < 20000:
                steps += 1
                visited.add(curr)
                found_next = False
                for i in range(8):
                    nd = (d + i) % 8
                    nx, ny = curr[0] + dirs[nd][0], curr[1] + dirs[nd][1]
                    if grid[ny][nx] == 1:
                        poly.append((nx-1, ny-1))
                        d = (nd + 5) % 8
                        curr = (nx, ny)
                        found_next = True
                        break
                if not found_next or curr == start_pt:
                    break
            if len(poly) > 10:
                polygons.append(poly)

def poly_to_path_d(poly, offset_x=0, offset_y=0):
    simp = rdp(poly, 0.75)
    cmds = [f'M {simp[0][0]-offset_x:.1f} {simp[0][1]-offset_y:.1f}']
    for pt in simp[1:]:
        cmds.append(f'L {pt[0]-offset_x:.1f} {pt[1]-offset_y:.1f}')
    cmds.append('Z')
    return ' '.join(cmds)

os.makedirs('public/brand', exist_ok=True)

# 1. Mark only
mark_polys = [p for p in polygons if max(pt[0] for pt in p) <= 300]
mark_min_x = min(pt[0] for p in mark_polys for pt in p)
mark_min_y = min(pt[1] for p in mark_polys for pt in p)
mark_max_x = max(pt[0] for p in mark_polys for pt in p)
mark_max_y = max(pt[1] for p in mark_polys for pt in p)
mark_w = mark_max_x - mark_min_x + 1
mark_h = mark_max_y - mark_min_y + 1

mark_d = ' '.join(poly_to_path_d(p, mark_min_x, mark_min_y) for p in mark_polys)

mark_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {mark_w:.1f} {mark_h:.1f}" fill="none">
  <path d="{mark_d}" fill="#BB4C6C" fill-rule="evenodd" />
</svg>
'''

with open('public/brand/logo-mark.svg', 'w') as f:
    f.write(mark_svg)

# 2. Full logo
all_min_x = min(pt[0] for p in polygons for pt in p)
all_min_y = min(pt[1] for p in polygons for pt in p)
all_max_x = max(pt[0] for p in polygons for pt in p)
all_max_y = max(pt[1] for p in polygons for pt in p)
full_w = all_max_x - all_min_x + 1
full_h = all_max_y - all_min_y + 1

full_d = ' '.join(poly_to_path_d(p, all_min_x, all_min_y) for p in polygons)

full_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {full_w:.1f} {full_h:.1f}" fill="none">
  <path d="{full_d}" fill="#BB4C6C" fill-rule="evenodd" />
</svg>
'''

with open('public/brand/logo-full.svg', 'w') as f:
    f.write(full_svg)

# 3. Full white logo (for dark background)
full_white_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {full_w:.1f} {full_h:.1f}" fill="none">
  <path d="{full_d}" fill="#FFFFFF" fill-rule="evenodd" />
</svg>
'''

with open('public/brand/logo-full-white.svg', 'w') as f:
    f.write(full_white_svg)

print('Generated SVGs in public/brand/ successfully!')
print(f'Mark: {mark_w}x{mark_h}, Full: {full_w}x{full_h}')

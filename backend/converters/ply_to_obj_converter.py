# converters/ply_to_obj_converter.py - PLY to OBJ conversion logic
from utils.dependencies import MESH_AVAILABLE

async def ply_to_obj_converter(ply_path: str, output_path: str) -> bool:
    """Convert PLY to OBJ format"""
    if not MESH_AVAILABLE:
        return False

    try:
        import struct
        import re

        # Read PLY file
        with open(ply_path, 'rb') as ply_file:
            # Read header
            header_lines = []
            while True:
                line = ply_file.readline().decode('ascii').strip()
                header_lines.append(line)
                if line == 'end_header':
                    break

        # Parse header
        vertex_count = 0
        face_count = 0
        is_binary = False
        vertex_properties = []
        face_properties = []

        for line in header_lines:
            if line.startswith('format'):
                if 'binary' in line:
                    is_binary = True
            elif line.startswith('element vertex'):
                vertex_count = int(line.split()[-1])
            elif line.startswith('element face'):
                face_count = int(line.split()[-1])
            elif line.startswith('property') and vertex_count > 0 and face_count == 0:
                vertex_properties.append(line.split()[1:])
            elif line.startswith('property') and face_count > 0:
                face_properties.append(line.split()[1:])

        vertices = []
        faces = []

        if is_binary:
            # Binary PLY format
            for i in range(vertex_count):
                vertex = []
                for prop in vertex_properties:
                    if prop[0] in ['float', 'float32']:
                        value = struct.unpack('<f', ply_file.read(4))[0]
                    elif prop[0] in ['double', 'float64']:
                        value = struct.unpack('<d', ply_file.read(8))[0]
                    elif prop[0] in ['int', 'int32']:
                        value = struct.unpack('<i', ply_file.read(4))[0]
                    elif prop[0] in ['uchar', 'uint8']:
                        value = struct.unpack('<B', ply_file.read(1))[0]
                    else:
                        value = 0
                    vertex.append(value)

                # Take first 3 values as x, y, z
                if len(vertex) >= 3:
                    vertices.append([vertex[0], vertex[1], vertex[2]])

            for i in range(face_count):
                # Read vertex count for this face
                vertex_count_in_face = struct.unpack('<B', ply_file.read(1))[0]
                face = []
                for j in range(vertex_count_in_face):
                    vertex_index = struct.unpack('<I', ply_file.read(4))[0]
                    face.append(vertex_index + 1)  # OBJ uses 1-based indexing
                if len(face) >= 3:
                    faces.append(face)

        else:
            # ASCII PLY format
            # Continue reading from current position
            content = ply_file.read().decode('ascii', errors='ignore')
            lines = content.strip().split('\n')

            line_index = 0

            # Read vertices
            for i in range(vertex_count):
                if line_index < len(lines):
                    values = lines[line_index].split()
                    if len(values) >= 3:
                        try:
                            x = float(values[0])
                            y = float(values[1])
                            z = float(values[2])
                            vertices.append([x, y, z])
                        except ValueError:
                            pass
                    line_index += 1

            # Read faces
            for i in range(face_count):
                if line_index < len(lines):
                    values = lines[line_index].split()
                    if len(values) >= 4:  # At least count + 3 vertices
                        try:
                            vertex_count_in_face = int(values[0])
                            face = []
                            for j in range(1, min(vertex_count_in_face + 1, len(values))):
                                face.append(int(values[j]) + 1)  # OBJ uses 1-based indexing
                            if len(face) >= 3:
                                faces.append(face)
                        except ValueError:
                            pass
                    line_index += 1

        # Write OBJ file
        with open(output_path, 'w') as obj_file:
            # Write header
            obj_file.write("# OBJ file converted from PLY\n")
            obj_file.write(f"# {len(vertices)} vertices, {len(faces)} faces\n\n")

            # Write vertices
            for vertex in vertices:
                obj_file.write(f"v {vertex[0]:.6f} {vertex[1]:.6f} {vertex[2]:.6f}\n")

            obj_file.write("\n")

            # Write faces
            for face in faces:
                if len(face) == 3:
                    obj_file.write(f"f {face[0]} {face[1]} {face[2]}\n")
                elif len(face) == 4:
                    obj_file.write(f"f {face[0]} {face[1]} {face[2]} {face[3]}\n")
                elif len(face) > 4:
                    # Triangulate polygon
                    for i in range(1, len(face) - 1):
                        obj_file.write(f"f {face[0]} {face[i]} {face[i+1]}\n")

        return True

    except Exception as e:
        print(f"PLY to OBJ conversion error: {e}")
        return False
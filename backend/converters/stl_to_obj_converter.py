# converters/stl_to_obj_converter.py - STL to OBJ conversion logic
from utils.dependencies import MESH_AVAILABLE

async def stl_to_obj_converter(stl_path: str, output_path: str) -> bool:
    """Convert STL to OBJ format"""
    if not MESH_AVAILABLE:
        return False

    try:
        import numpy as np
        from stl import mesh
        import struct

        # Read STL file
        stl_mesh = mesh.Mesh.from_file(stl_path)

        # Extract vertices and faces
        vertices = []
        faces = []
        vertex_map = {}
        vertex_index = 1

        for triangle in stl_mesh.vectors:
            face_indices = []

            for vertex in triangle:
                # Create a tuple for the vertex (for hashing)
                vertex_tuple = tuple(vertex)

                # Check if vertex already exists
                if vertex_tuple not in vertex_map:
                    vertices.append(vertex)
                    vertex_map[vertex_tuple] = vertex_index
                    face_indices.append(vertex_index)
                    vertex_index += 1
                else:
                    face_indices.append(vertex_map[vertex_tuple])

            faces.append(face_indices)

        # Write OBJ file
        with open(output_path, 'w') as obj_file:
            # Write header
            obj_file.write("# OBJ file converted from STL\n")
            obj_file.write(f"# {len(vertices)} vertices, {len(faces)} faces\n\n")

            # Write vertices
            for vertex in vertices:
                obj_file.write(f"v {vertex[0]:.6f} {vertex[1]:.6f} {vertex[2]:.6f}\n")

            obj_file.write("\n")

            # Write faces (OBJ uses 1-based indexing)
            for face in faces:
                obj_file.write(f"f {face[0]} {face[1]} {face[2]}\n")

        return True

    except Exception as e:
        print(f"STL to OBJ conversion error: {e}")
        return False
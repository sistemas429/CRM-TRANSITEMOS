"""Usuarios y áreas de demostración (solo para pruebas).

Uso: python seed_demo.py
"""
from modules.auth.models import User, Role
from modules.auth.security import hash_password
from modules.tickets.models import Area
from core.database import SessionLocal

db = SessionLocal()

DEMO_USERS = [
    ("administrador", "ChangeMe123!", "admin"),
    ("tecnico2", "ChangeMe123!", "tecnico"),
    ("solicitante2", "ChangeMe123!", "solicitante"),
]

for username, password, role_name in DEMO_USERS:
    if db.query(User).filter(User.username == username).first():
        print(f"Usuario {username} ya existe.")
        continue
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        print(f"Rol {role_name} no encontrado, omitido.")
        continue
    db.add(User(username=username, hashed_password=hash_password(password), role_id=role.id))
    print(f"Usuario {username} creado con rol {role_name}.")

DEMO_AREAS = ["Tránsito", "Seguridad", "Señalización", "Atención al Ciudadano"]
for name in DEMO_AREAS:
    if db.query(Area).filter(Area.name == name).first():
        print(f"Área {name} ya existe.")
        continue
    db.add(Area(name=name))
    print(f"Área {name} creada.")

db.commit()
db.close()
print("Listo.")


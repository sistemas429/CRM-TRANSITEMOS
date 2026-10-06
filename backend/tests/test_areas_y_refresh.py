"""Pruebas del endpoint de refresh token y CRUD de áreas."""


def _login(client, username, password):
    response = client.post("/auth/login", json={"username": username, "password": password})
    return response.json()


def test_refresh_devuelve_nuevos_tokens(client, admin_user):
    username, password = admin_user
    tokens = _login(client, username, password)

    response = client.post("/auth/refresh", json={"refresh_token": tokens["refresh_token"]})

    assert response.status_code == 200
    assert "access_token" in response.json()


def test_refresh_con_token_invalido_falla(client):
    response = client.post("/auth/refresh", json={"refresh_token": "token-falso"})
    assert response.status_code == 401


def test_admin_puede_crear_y_eliminar_area(client, admin_user):
    username, password = admin_user
    token = _login(client, username, password)["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    r1 = client.post("/areas/", json={"name": "Area Test"}, headers=headers)
    assert r1.status_code == 201
    area_id = r1.json()["id"]

    r2 = client.get("/areas/", headers=headers)
    assert any(a["name"] == "Area Test" for a in r2.json())

    r3 = client.delete(f"/areas/{area_id}", headers=headers)
    assert r3.status_code == 200

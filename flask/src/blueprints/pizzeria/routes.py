from flask import Blueprint, jsonify, request
from database import mysql
import os
import json
from datetime import date

pizzeria_bp = Blueprint(
    'pizzeria',
    __name__,
    url_prefix='/pizzeria'
)

ARCHIVO_TEMP = os.path.join(os.path.dirname(__file__), 'carrito_temp.txt')


def leer_temporal():
    if not os.path.exists(ARCHIVO_TEMP):
        return []
    pizzas = []
    with open(ARCHIVO_TEMP, 'r', encoding='utf-8') as f:
        for i, linea in enumerate(f):
            linea = linea.strip()
            if linea:
                partes = linea.split('|')
                if len(partes) == 4:
                    pizzas.append({
                        'id': i,
                        'tamano': partes[0],
                        'ingredientes': partes[1],
                        'numPizzas': int(partes[2]),
                        'subtotal': float(partes[3])
                    })
    return pizzas


def guardar_temporal(pizzas):
    with open(ARCHIVO_TEMP, 'w', encoding='utf-8') as f:
        for p in pizzas:
            f.write(f"{p['tamano']}|{p['ingredientes']}|{p['numPizzas']}|{p['subtotal']}\n")


# 1. LISTAR PIZZAS TEMPORALES (GET /pizzeria/temporal)
@pizzeria_bp.route("/temporal", strict_slashes=False, methods=['GET'])
def obtener_temporal():
    try:
        pizzas = leer_temporal()
        return jsonify({'pizzas': pizzas, 'exito': True}), 200
    except Exception as ex:
        return jsonify({'mensaje': f"Error: {ex}", 'exito': False}), 500


# 2. AGREGAR PIZZA TEMPORAL (POST /pizzeria/temporal)
@pizzeria_bp.route("/temporal", strict_slashes=False, methods=['POST'])
def agregar_temporal():
    datos = request.get_json(silent=True)
    if not isinstance(datos, dict):
        return jsonify({'mensaje': 'Se requiere un objeto JSON', 'exito': False}), 400

    tamano = datos.get('tamano', 'Chica')
    ingredientes_lista = datos.get('ingredientes', [])
    num_pizzas = int(datos.get('numPizzas', 1))

    precios_tamano = {
        'Chica': 40,
        'Mediana': 80,
        'Grande': 120
    }
    precio_base = precios_tamano.get(tamano, 40)

    if isinstance(ingredientes_lista, list):
        costo_ingredientes = len(ingredientes_lista) * 10
        ingredientes_texto = ", ".join(ingredientes_lista) if ingredientes_lista else "Sin ingredientes"
    else:
        ingredientes_texto = str(ingredientes_lista)
        costo_ingredientes = 0

    subtotal = (precio_base + costo_ingredientes) * num_pizzas

    pizzas = leer_temporal()
    pizzas.append({
        'tamano': tamano,
        'ingredientes': ingredientes_texto,
        'numPizzas': num_pizzas,
        'subtotal': subtotal
    })
    guardar_temporal(pizzas)

    return jsonify({
        'pizzas': leer_temporal(),
        'mensaje': 'Pizza agregada al detalle',
        'exito': True
    }), 201


@pizzeria_bp.route("/temporal/<int:index>", methods=['DELETE'])
def quitar_temporal(index):
    try:
        pizzas = leer_temporal()
        if 0 <= index < len(pizzas):
            pizzas.pop(index)
            guardar_temporal(pizzas)
        return jsonify({
            'pizzas': leer_temporal(),
            'mensaje': 'Pizza eliminada del detalle',
            'exito': True
        }), 200
    except Exception as ex:
        return jsonify({'mensaje': f"Error: {ex}", 'exito': False}), 500


@pizzeria_bp.route("/pedidos", strict_slashes=False, methods=['POST'])
def terminar_pedido():
    datos = request.get_json(silent=True)
    if not isinstance(datos, dict):
        return jsonify({'mensaje': 'Se requiere un objeto JSON', 'exito': False}), 400

    pizzas = leer_temporal()
    if not pizzas:
        return jsonify({'mensaje': 'No hay pizzas agregadas en el pedido', 'exito': False}), 400

    nombre = datos.get('nombre', '').strip()
    direccion = datos.get('direccion', '').strip()
    telefono = datos.get('telefono', '').strip()
    fecha = datos.get('fecha', '').strip() or str(date.today())

    total = sum(p['subtotal'] for p in pizzas)
    detalles_json = json.dumps(pizzas, ensure_ascii=False)

    cursor = None
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("""
            INSERT INTO pedidos (nombre, direccion, telefono, fecha, total, detalles)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (nombre, direccion, telefono, fecha, total, detalles_json))
        mysql.connection.commit()

        guardar_temporal([])

        return jsonify({
            'total': total,
            'mensaje': 'Pedido guardado correctamente',
            'exito': True
        }), 201

    except Exception as ex:
        mysql.connection.rollback()
        return jsonify({'mensaje': f"Error al guardar pedido: {ex}", 'exito': False}), 500

    finally:
        if cursor is not None:
            cursor.close()


@pizzeria_bp.route("/pedidos", strict_slashes=False, methods=['GET'])
def listar_pedidos():
    cursor = None
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id, nombre, direccion, telefono, fecha, total, detalles FROM pedidos")
        datos = cursor.fetchall()

        pedidos = []
        for fila in datos:
            try:
                detalles = json.loads(fila[6]) if fila[6] else []
            except:
                detalles = []
            pedidos.append({
                'id': fila[0],
                'nombre': fila[1],
                'direccion': fila[2],
                'telefono': fila[3],
                'fecha': fila[4],
                'total': fila[5],
                'detalles': detalles
            })

        return jsonify({'pedidos': pedidos, 'exito': True}), 200

    except Exception as ex:
        return jsonify({'mensaje': f"Error: {ex}", 'exito': False}), 500

    finally:
        if cursor is not None:
            cursor.close()

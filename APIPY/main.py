from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configura tu clave de API de OpenAI
client = OpenAI(api_key='API KEY')

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    pregunta = data['pregunta']

    try:
        # Llama a la API de OpenAI para obtener una respuesta
        respuesta = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": pregunta}],
            max_tokens=50
        )

        return jsonify({'respuesta': respuesta.choices[0].message.content})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

'''from openai import OpenAI

client = OpenAI(api_key='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')

def enviar_pregunta(pregunta):
    try:
        # Llama a la API de OpenAI para obtener una respuesta
        respuesta = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": pregunta}],
            max_tokens=50
        )

        return respuesta.choices[0].message.content

    except Exception as e:
        return str(e)

def main():

    while True:
        # Recibe la pregunta del usuario
        pregunta = input("Tú: ")

        # Envía la pregunta a OpenAI y obtiene la respuesta
        respuesta = enviar_pregunta(pregunta)

        # Imprime la respuesta del chatbot
        print("Chatbot:", respuesta)

if __name__ == "__main__":
    main()
'''

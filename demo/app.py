from flask import Flask
app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Reliably is born."


if __name__ == "__main__":
    app.run()


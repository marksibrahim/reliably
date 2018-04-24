from flask import Flask, render_template
app = Flask(__name__)


@app.route("/hello")
def hello_world():
    return "Reliably is born."

@app.route("/")
def dashboard():
    return render_template("index.html")



if __name__ == "__main__":
    app.run()


from flask import Flask, request, jsonify
import json
import threading

app = Flask(__name__)

DB_FILE = "accounts.json"

def load_accounts():
    try:
        with open(DB_FILE) as f:
            return json.load(f)
    except:
        return []

def save_accounts(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f)

@app.route("/add", methods=["POST"])
def add():
    data = request.json
    accounts = load_accounts()
    accounts.append(data)
    save_accounts(accounts)
    return "ok"

@app.route("/accounts")
def accounts():
    return jsonify(load_accounts())

@app.route("/run", methods=["POST"])
def run():
    username = request.json["username"]
    threading.Thread(target=run_bot, args=(username,)).start()
    return "running"

# ================= BOT =================

from selenium import webdriver
import time
import random

def run_bot(username):
    accounts = load_accounts()
    acc = next(a for a in accounts if a["username"] == username)

    driver = webdriver.Chrome()
    driver.get("https://facebook.com")

    time.sleep(20)  # login tay

    # lướt feed
    for _ in range(random.randint(5,10)):
        driver.execute_script("window.scrollBy(0, 600)")
        time.sleep(random.randint(2,5))

    # like
    likes = driver.find_elements("xpath", '//div[@aria-label="Like"]')
    for like in likes[:5]:
        try:
            like.click()
            time.sleep(random.randint(3,6))
        except:
            pass

    # đăng bài
    # (bạn có thể nâng cấp phần này sau)

    driver.quit()

# =======================================

if __name__ == "__main__":
    app.run(debug=True)

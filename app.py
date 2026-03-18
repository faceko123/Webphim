from flask import Flask, render_template, request, jsonify
import json
import threading
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import random

app = Flask(__name__)
DB_FILE = "accounts.json"

# Khởi tạo file JSON nếu chưa có
if not os.path.exists(DB_FILE):
    with open(DB_FILE, "w") as f:
        json.dump([], f)

def load_accounts():
    with open(DB_FILE, "r") as f:
        return json.load(f)

def save_accounts(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/add", methods=["POST"])
def add():
    data = request.json
    accounts = load_accounts()
    # Kiểm tra trùng lặp
    if any(acc['username'] == data['username'] for acc in accounts):
        return "Account exists", 400
    accounts.append(data)
    save_accounts(accounts)
    return "ok"

@app.route("/accounts")
def get_accounts():
    return jsonify(load_accounts())

def run_bot(username):
    accounts = load_accounts()
    acc = next((a for a in accounts if a["username"] == username), None)
    if not acc: return

    chrome_options = Options()
    # chrome_options.add_argument("--headless") # Chạy ẩn danh nếu muốn nhẹ máy
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        driver.get("https://facebook.com")
        # Tự động điền pass thay vì chờ 20s (tùy chọn)
        # driver.find_element("id", "email").send_keys(acc['username'])
        # driver.find_element("id", "pass").send_keys(acc['password'])
        
        time.sleep(15) # Chờ bạn thao tác 2FA hoặc kiểm tra

        # Lướt Feed thông minh hơn
        for _ in range(random.randint(3, 7)):
            scroll_height = random.randint(400, 900)
            driver.execute_script(f"window.scrollBy(0, {scroll_height})")
            time.sleep(random.uniform(2.5, 5.0))
            
    except Exception as e:
        print(f"Lỗi khi chạy {username}: {e}")
    finally:
        driver.quit()

@app.route("/run", methods=["POST"])
def run():
    username = request.json["username"]
    threading.Thread(target=run_bot, args=(username,)).start()
    return "running"

if __name__ == "__main__":
    app.run(debug=True, port=5000)

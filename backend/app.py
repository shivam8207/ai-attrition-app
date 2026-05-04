from quart import Quart, render_template, request,jsonify,send_from_directory,session,redirect,url_for,Response
from typing import Dict
from model import getAttrition,getAttritionBulk
import pandas as pd
from pathlib import Path
app = Quart(__name__)
app.secret_key = '4ec42e0f4a56e99e7a315fab323a10a27f14182ef73cb0afsdwrrwmkmk06'
valid_user = {'username': 'dbhasker', 'password': 'DBhasker#2@23'}


@app.route('/')
async def index():
    if True:
        return await send_from_directory("static", "index.html")
    return redirect(url_for('login_temp'))

# @app.route("/favicon.ico")
# async def favicon():
#     if True:
#         return  send_from_directory("static", "favicon.ico")
#     else:
#         return "ok"


@app.route("/assets/<path:path>")
async def assets(path):
    if True:
        return await send_from_directory(Path(__file__).resolve().parent / "static" / "assets", path)


@app.route('/attr',methods=['POST'])
async def attr(): 
    try:
        data: Dict[str,str] = await request.get_json()
        attrition = getAttrition(data)
        return jsonify({
        "attrition": attrition
        })
    except Exception as e:
        print(e)
        return jsonify({
            "error": "Server error occured" + str(e)
        }),404


@app.route('/upload',methods=["POST"])
async def upload_csv():
    try:
        form_data = await request.files
        csv_file = form_data.get('file')
        print(csv_file)
        df = pd.read_csv(csv_file)
        print(df)
        result = getAttritionBulk(df)
        result = result.tolist()
        return jsonify(result)
    except Exception as e:
        if e == ValueError:
            return jsonify({
                "error": str("There is a type mismatch. Ensure number of columns in CSV are 7 and all column excluding name are numbers.")
            }),404
        return jsonify({
                "error": str("There is a type mismatch. Ensure number of columns in CSV are 7 and all column excluding name are numbers.")
            }),404
    
@app.route("/down", methods=["POST"])
async def download():
    try:
        print("assssssssssssssssssssssssssssssssssssssss")
        form_data = await request.get_json()
        print(form_data)
        table_data = form_data['data']
        df = pd.DataFrame(table_data, columns=["Name","ExpYrs","TotalOrgs","MonthsInOrg","LastPay","Feedback","Poromotion","AttritionData"])
        csv_file = df.to_csv(index=False)
        return Response(
            csv_file,
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=my_data.csv"}
        )

    except Exception as e:
        return jsonify({
            "error": "Server error Occured" + str(e)
        }),404


if __name__ == "__main__":
    app.run(debug=True)
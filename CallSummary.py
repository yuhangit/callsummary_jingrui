import time,os
from flask import Flask, flash, redirect, url_for, session, send_file
from flask import render_template, abort
from flask import request
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_required, login_user, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import SubmitField
from flask_bootstrap import Bootstrap
from flask_moment import Moment

from wtforms import StringField, PasswordField

import dateparser
import json
from wtforms.validators import DataRequired
import datetime

import utils

current_directory = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///%s/jingrui.sqlite" % current_directory
app.config["SECRET_KEY"] = 'JAFAEOJFA203432w83'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db = SQLAlchemy(app)
bootstrap = Bootstrap(app)
moment = Moment(app)


class PhoneCall(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    station = db.Column(db.String(10))
    src_phone = db.Column(db.String(255))
    district =db.Column(db.Text())
    subject = db.Column(db.String(50))
    grade = db.Column(db.String(30))
    name = db.Column(db.String(50))
    phone = db.Column(db.String(20))
    remark = db.Column(db.Text())
    dt = db.Column(db.DATETIME())
    operator = db.Column(db.String(30))
    student_name = db.Column(db.String(30))
    age = db.Column(db.String(30))
    category = db.Column(db.Text())
    home_address = db.Column(db.Text())
    book_dt = db.Column(db.DATETIME())

    def __repr__(self):
        return "<Operator(%s):%d>" %(self.operator, self.id)


class UserForm(FlaskForm):
    name = StringField("text here", validators=[DataRequired()])
    submit = SubmitField("Submit")


class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))
    password = db.Column(db.String(30))

    def __repr__(self):
        return "<User:%s>" % self.name


# login form
class LoginForm(FlaskForm):
    name = StringField("name", validators=[DataRequired()])
    passwd = PasswordField("passwd", validators=[DataRequired()])


# flask-login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


category_name = {"ydy":"",
                 'zhxt':'_智慧学堂'}

downloaders = ("张晓", 'yuhan')

@app.route("/getstats/")
@app.route("/getstats/<dt>")
@login_required
def get_stats(dt=None):

    if current_user.name not in downloaders:
        abort(403,"权限不足")
    am_pm = "AM"
    # am /pm
    category = request.args.get("ct") or 'ydy'
    if category not in category_name:
        abort(400,"argument ct must be ydy or zhxt")
    dt_end = dateparser.parse(dt, date_formats=["%Y%m%d%H"]) if dt is not None else datetime.datetime.now()
    dt = dt_end.strftime("%Y%m%d")

    # if dt_end.weekday() == 6:
    #     dt_pm = datetime.datetime(year=dt_end.year, month=dt_end.month, day=dt_end.day, hour=16, minute=45, second=0)
    # else:
    # 8月30改到下午5：30截止下载
    dt_pm = datetime.datetime(year=dt_end.year, month=dt_end.month, day=dt_end.day, hour=17, minute=30, second=0)

    dt_pm_yester = dt_pm - datetime.timedelta(days=1)
    if dt_end.hour > 13:
        dt_start = datetime.datetime(year=dt_end.year, month=dt_end.month, day=dt_end.day, hour=13, minute=0, second=0)
        am_pm = "PM"

        # if today is friday
        if dt_end.weekday() == 4:
            dt_pm = dt_pm.replace(hour=16, minute=45)
        if dt_end > dt_pm:
           dt_end = dt_pm

    else:
        dt_start = dt_pm_yester
        # if today is monday
        if dt_start.weekday() == 6:
            dt_start = datetime.datetime(year=dt_end.year, month=dt_end.month, day=dt_end.day, hour=16, minute=45, second=0) - datetime.timedelta(days=3)
    print(dt_start, dt_end)
    send_name = "%s统计%s.xlsx" % (dt, category_name.get(category))
    filename = "tmp/%s.%s" % (send_name, int(time.time()))
    utils.createXlsx(dt_start, dt_end, filename, am_pm, category)
    return send_file(filename, attachment_filename=send_name, as_attachment=True, cache_timeout=1)


@app.route('/')
def home():
    infos = None
    db.session.expire_all()
    if current_user.is_authenticated:
        infos = PhoneCall.query.filter_by(operator=current_user.name).filter(
            PhoneCall.dt >= datetime.datetime.now().date()).order_by(PhoneCall.dt.desc(),PhoneCall.id.desc()).all()
    return render_template("index.html",infos = infos, downloaders=downloaders)


@app.route("/login", methods=["POST"])
def login():
    name = request.form["name"]
    passwd = request.form["passwd"]
    user = User.query.filter_by(name=name).first()
    if user is not None and user.password == passwd:
        login_user(user, remember=True)
        if session.get("login_retry",0) > 0:
            session["login_retry"] = 0
        flash("登陆成功")
        return redirect(url_for("home") )
    session["login_retry"] = session.get("login_retry", 0) + 1
    flash("用户名或密码错误")
    return redirect(url_for("home"))


@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("已经退出登录")
    return redirect(url_for("home"))


@app.route("/safe/<p>", methods=["POST","GET"])
def safe(p):
    dt = datetime.datetime.utcnow()

    form = UserForm()
    if form.validate_on_submit():
        old_name = session.get("name")
        if old_name is not None and old_name != form.name.data:
            flash("things like you change your name")
        session["name"] = form.name.data
        form.name.data = None
        redirect(url_for("safe",p=p))
    return render_template("safe.html", p=p,current_time=dt, form=form, name=session.get("name"))


@app.route("/addinfo", methods=["POST"])
@login_required
def addinfo():
    info = request.get_json(force=True)
    info["dt"] = dateparser.parse(info["dt"])
    info["book_dt"] = dateparser.parse(info.get("book_dt")) if info.get("book_dt") else None
    info["operator"] = current_user.name
    info = PhoneCall(**info)
    db.session.add(info)
    db.session.commit()
    return json.dumps({"success":True, "id":info.id}),200, {"contentType":"application/json"}


@app.route("/delinfo", methods=["POST"])
@login_required
def delinfo():
    info_id = int(request.get_json(force=True)["id"])
    info = PhoneCall.query.get(info_id)
    print(info)
    if info:
        db.session.delete(info)
        db.session.commit()
    return json.dumps({"success":True}),200, {"contentType":"application/json"}


if __name__ == '__main__':
    app.run(host="0.0.0.0",port="5665",debug=True)

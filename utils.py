import xlsxwriter
import datetime
import CallSummary
from collections import OrderedDict
import os

curDir = os.path.dirname(__file__)


def createXlsx(start_dt: datetime.datetime, end_dt: datetime.datetime, filename="test.xlsx", am_pm="AM",
               category='yhy'):
    fileFullPath = os.path.normpath(os.path.join(curDir, filename))

    worksheet_basename = end_dt.strftime("%Y.%m.%d")
    workbook = xlsxwriter.Workbook(fileFullPath)
    if category == 'ydy':
        infos = CallSummary.PhoneCall.query.filter(CallSummary.PhoneCall.dt >= start_dt, CallSummary.PhoneCall.dt <= end_dt,
                                               CallSummary.PhoneCall.category == category).all()
    else:
        infos = CallSummary.PhoneCall.query.filter(CallSummary.PhoneCall.category == category).all()

    worksheet = workbook.add_worksheet(worksheet_basename)

    if category == 'yhy':
        # ydy worksheet

        headers = OrderedDict([("序号", "seq_id"), ("客户姓名", "name"), ("电话号码", "phone"), ("家庭基本住址", "district")
                                  , ("就读学校&年级", "grade"), ("薄弱科目(希望补习科目)", "subject"), ("备注", "remark")])

        headers_format = workbook.add_format()
        headers_format.set_bg_color("#2F92CA")
        headers_format.set_bold()
        headers_format.set_font_color("white")
        headers_format.set_font_size(11)
        headers_format.set_border(1)
        headers_format.set_text_wrap(True)

        body_format = workbook.add_format()
        body_format.set_bg_color("#95B3D7")
        body_format.set_align("center")
        body_format.set_align("vcenter")
        body_format.set_border(1)
        body_format.set_text_wrap(True)
        # headers_format.set_font_family("宋体")

        for i, header in enumerate(headers.keys()):
            worksheet.write(0, i + 1, header, headers_format)

        for i, info in enumerate(infos):
            for j, header in enumerate(headers.values()):
                if header == "seq_id":
                    worksheet.write(i + 1, 1, "%03d" % (i + 1), body_format)
                else:
                    worksheet.write(i + 1, j + 1, getattr(info, header), body_format)

        last_row = 1 if len(infos) == 0 else len(infos)
        last_column = len(headers) + 1
        if last_row == 1:
            worksheet.write(1, 0, am_pm, body_format)
        else:
            worksheet.merge_range(1, 0, last_row, 0, am_pm, body_format)

        worksheet.set_column(1, 3, 15)
        worksheet.set_column(4, 6, 10)
        worksheet.set_column(2, 2, 10)
        worksheet.set_column(5, 5, 30)
        worksheet.set_column(7, 7, 30)

        worksheet_all = workbook.add_worksheet(worksheet_basename + "_all")
        headers_all = OrderedDict(
            [("序号", "seq_id"), ("话务员", "operator"), ("密号", "src_phone"), ("客户姓名", "name"), ("电话号码", "phone"),
             ("家庭基本住址", "district")
                , ("就读学校&年级", "grade"), ("薄弱科目(希望补习科目)", "subject"), ("备注", "remark"), ("录入时间", "dt")])

        for i, header in enumerate(headers_all.keys()):
            worksheet_all.write(0, i + 1, header, headers_format)

        for i, info in enumerate(infos):
            for j, header in enumerate(headers_all.values()):
                if header == "seq_id":
                    worksheet_all.write(i + 1, 1, "%03d" % (i + 1), body_format)
                elif header == "dt":
                    dtStr = getattr(info, header)
                    worksheet_all.write(i + 1, j + 1, dtStr.strftime("%Y-%m-%d %H:%M:%S"), body_format)
                else:
                    worksheet_all.write(i + 1, j + 1, getattr(info, header), body_format)

        if last_row == 1:
            worksheet_all.write(1, 0, am_pm, body_format)
        else:
            worksheet_all.merge_range(1, 0, last_row, 0, am_pm, body_format)

        worksheet_all.set_column(1, 5, 15)
        worksheet_all.set_column(6, 8, 10)
        worksheet_all.set_column(3, 2, 10)
        worksheet_all.set_column(7, 7, 30)
        worksheet_all.set_column(9, 9, 30)

    elif category == 'zhxt':
        headers = OrderedDict([("家长姓名", "name"), ("学生姓名", "student_name"), ("电话号码", "phone"), ("年龄", "age"),
                               ("所在域", "home_address"), ("学习中心", "district"), ('预约时间', 'book_dt'), ("备注", "remark")])
        headers_format = workbook.add_format()
        headers_format.set_bg_color("#F4B084")
        headers_format.set_font_color("black")
        headers_format.set_align('center')
        headers_format.set_font_size(11)
        headers_format.set_border(1)
        headers_format.set_text_wrap(True)

        body_format = workbook.add_format()
        body_format.set_text_wrap(True)

        for i, header in enumerate(headers.keys()):
            worksheet.write(0, i, header, headers_format)

        for i, info in enumerate(infos):
            for j, header in enumerate(headers.values()):
                    if header == 'book_dt':
                        dtStr = getattr(info, header)
                        worksheet.write(i + 1, j, dtStr.strftime("%Y-%m-%d"), body_format)
                    else:
                        worksheet.write(i + 1, j, getattr(info, header), body_format)
        worksheet.set_column(0, 1, 10)
        worksheet.set_column(2, 2, 15)
        worksheet.set_column(3, 3, 5)
        worksheet.set_column(4, 5, 25)
        worksheet.set_column(6, 6, 12)
        worksheet.set_column(7, 7, 25)

    workbook.close()


if __name__ == "__main__":
    dt = datetime.datetime.now()
    createXlsx()

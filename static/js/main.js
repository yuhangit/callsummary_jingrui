 $(document).ready(function () {
            // 30分钟后隐藏删除按钮
            let min = 30;
            setInterval(removeButton,5000);
            function removeButton(){
                 $("table tbody tr").each(function () {
                    let dt = moment($(this).find("td")[0].innerHTML);
                    console.log(moment.now() - dt > min*1000*60);
                    if (moment.now() - dt > 30*1000*60){
                        let btns = $(this).find("button");
                        if(btns.length !== 0){
                            //delete first tr included button
                            this.removeChild(btns[0].parentNode)
                        }
                    }
                })
            }
            removeButton();



            var infoArr = [],
            infoJson = {},
            infoArrXueTang = [],
            infoJsonXueTang = {};
            // check input information -- yiduiyi
            $("#info-textarea").on("change paste keyup",  function () {
                infoArr = [];
                var s = $(this).val();

                 //console.log(s);
                //var reg = /\S+/g;
                //var matched_reg = s.match(reg);
                var matched_reg= s.replace(/，/ig,",").split(",").map(function (value) {
                    return value.trim();
                });
                //console.log(matched_reg);
                if (matched_reg.length < 6){
                    $("#input-check").addClass("alert-danger");
                    $("#input-check").text("输入的数据格式错误");
                    $("#input-submit").attr("disabled","disabled")
                }
                var station = matched_reg[0] ;
                var src_phone = matched_reg[1];
                var district = matched_reg[2];
                var grade = matched_reg[3];
                var subject = matched_reg[4];
                var name = matched_reg[5];
                var phone = matched_reg[6].replace(/\ /g,"");
                var remark = matched_reg[7] || "" ;
                //console.log("phone:");
                //console.log(phone);
                var regmobile = /^0?1[3|4|5|6|8][0-9]\d{8}$/;//手机
                if (!regmobile.test(phone)){
                    $("#input-check").addClass("alert-danger");
                    $("#input-check").text("电话号码有误");
                    $("#input-submit").attr("disabled","disabled")
                }else{
                    $("#input-check").html("");

                    var dt = moment();
                    var ls = $("<ol class='breadcrumb'></ol>");
                    var station_tag = $("<li class='breadcrumb-item'></li>").text(station);
                    var src_phone_tag = $("<li class='breadcrumb-item'></li>").text(src_phone);
                    var district_tag = $("<li class='breadcrumb-item'></li>").text(district);
                    var subject_tag = $("<li class='breadcrumb-item'></li>").text(subject);
                    var grade_tag = $("<li class='breadcrumb-item'></li>").text(grade);
                    var name_tag = $("<li class='breadcrumb-item'></li>").text(name);
                    var phone_tag = $("<li class='breadcrumb-item'></li>").text(phone);
                    var remark_tag = $("<li class='breadcrumb-item'></li>").text(remark);

                    ls.append(station_tag,src_phone_tag,district_tag,subject_tag,grade_tag,name_tag,phone_tag,remark_tag);


                    $("#input-check").addClass("alert-info");
                    $("#input-submit").removeAttr("disabled");
                    $("#input-check").append(ls);
                    infoJson = {
                        "dt":dt.local().format("YYYY-MM-DD HH:mm:ss"),
                        "station":station,
                        "src_phone":src_phone,
                        "district":district,
                        "subject":subject,
                        "grade":grade,
                        "name":name,
                        "phone":phone,
                        "remark":remark,
                        "category":"ydy"
                    };
                    infoArr.push(dt.local().format("YYYY-MM-DD HH:mm:ss"),station,src_phone,district,grade,subject,name,phone,remark);
                }
            });
            // check input information -- xuetange
            $("#info-textarea-xuetang").on("change paste keyup",  function () {
                infoArrXueTang = [];
                var s = $(this).val();

//                console.log(s);
                //var reg = /\S+/g;
                //var matched_reg = s.match(reg);
                var matched_reg= s.replace(/，/ig,",").split(",").map(function (value) {
                    return value.trim();
                });
                console.log(matched_reg);
                if (matched_reg.length < 8){
                    $("#input-check-xuetang").addClass("alert-danger");
                    $("#input-check-xuetang").text("输入的数据格式错误");
                    $("#input-submit-xuetang").attr("disabled","disabled")
                }
                var station = matched_reg[0] ;
                var src_phone = matched_reg[1];
                var district = matched_reg[2];
                var home_address = matched_reg[3];
                var name = matched_reg[4];
                var phone = matched_reg[5].replace(/\ /g,"");
                var student_name = matched_reg[6];
                var age = matched_reg[7];
                var book_dt = matched_reg[8]
                var remark = matched_reg[9] || "" ;
                //console.log("phone:");
                //console.log(phone);
                var regmobile = /^0?1[3|4|5|6|8][0-9]\d{8}$/;//手机
                if (!regmobile.test(phone)){
                    $("#input-check-xuetang").addClass("alert-danger");
                    $("#input-check-xuetang").text("电话号码有误");
                    $("#input-submit-xuetang").attr("disabled","disabled")
                }else{
                    $("#input-check-xuetang").html("");

                    var dt = moment();
                    var ls = $("<ol class='breadcrumb'></ol>");
                    var station_tag = $("<li class='breadcrumb-item'></li>").text(station);
                    var src_phone_tag = $("<li class='breadcrumb-item'></li>").text(src_phone);
                    var district_tag = $("<li class='breadcrumb-item'></li>").text(district);
                    var home_address_tag = $("<li class='breadcrumb-item'></li>").text(home_address);
                    var name_tag = $("<li class='breadcrumb-item'></li>").text(name);
                    var phone_tag = $("<li class='breadcrumb-item'></li>").text(phone);
                    var student_name_tag = $("<li class='breadcrumb-item'></li>").text(student_name);
                    var age_tag = $("<li class='breadcrumb-item'></li>").text(age);
                    var book_dt_tag = $("<li class='breadcrumb-item'></li>").text(book_dt);
                    var remark_tag = $("<li class='breadcrumb-item'></li>").text(remark);

                    ls.append(station_tag,src_phone_tag,district_tag,home_address_tag,name_tag,phone_tag,student_name_tag
                        ,age_tag,book_dt_tag,remark_tag);


                    $("#input-check-xuetang").addClass("alert-info");
                    $("#input-submit-xuetang").removeAttr("disabled");
                    $("#input-check-xuetang").append(ls);
                    infoJsonXueTang = {
                        "dt":dt.local().format("YYYY-MM-DD HH:mm:ss"),
                        "station":station,
                        "src_phone":src_phone,
                        "district":district,
                        "home_address":home_address,
                        "name":name,
                        "phone":phone,
                        "student_name":student_name,
                        "age":age,
                        "book_dt":book_dt,
                        "remark":remark,
                        "category":"zhxt"
                    };
                    infoArrXueTang.push(dt.local().format("YYYY-MM-DD HH:mm:ss"),station,src_phone,district,home_address,
                        name,phone,student_name,age,book_dt,remark);
                }
            });

            // submit input -- yiduiyi
            $("#input-submit").on("click", function () {
                //console.log("click");
                if (infoArr.length == 0){
                    alert("请录入数据(一对一)");
                    return
                }

                $("#input-submit").attr("disabled","disabled");
                $.ajax({
                    type:"POST",
                    url:"addinfo",
                    data:JSON.stringify(infoJson),
                    datatype:"application/json",
                    success:function (msg) {
                        var msgobj = (JSON.parse(msg));
                        console.log(msgobj.id);
                         $("#completion-tbl tbody").prepend(
                               "<tr id=\""+ msgobj.id  +"\">" +  infoArr.map(function(ele){ return "<td>" + ele +"</td>";}).join(" ") + "<td><button class=\"btn btn-block btn-info\" aria-hidden=\"true\">删除</button></td>" +  "</tr>"
                          );
                        // init variable
                        $("#input-submit").removeAttr("disabled");
                        infoJson = {};
                        infoArr = [];
                    },
                    error:function (msg) {
                        alert("数据插入失败");
                        $("#input-submit").removeAttr("disabled");
                        infoJson = {};
                        infoArr = [];
                    }
                });
            });

            // submit input -- xuetang
            $("#input-submit-xuetang").on("click", function () {
                //console.log("click");
                if (infoArrXueTang.length == 0){
                    alert("请录入数学（智慧学堂）");
                    return
                }
                $("#input-submit-xuetang").attr("disabled","disabled");
                $.ajax({
                    type:"POST",
                    url:"addinfo",
                    data:JSON.stringify(infoJsonXueTang),
                    datatype:"application/json",
                    success:function (msg) {
                        var msgobj = (JSON.parse(msg));
                        console.log(msgobj.id);
                         $("#completion-tbl-xuetang tbody").prepend(
                               "<tr id=\""+ msgobj.id  +"\">" +  infoArrXueTang.map(function(ele){ return "<td>" + ele +"</td>";}).join(" ") + "<td><button class=\"btn btn-block btn-info\" aria-hidden=\"true\">删除</button></td>" +  "</tr>"
                          );
                        $("#input-submit-xuetang").removeAttr("disabled");
                        infoJsonXueTang = {};
                        infoArrXueTang = [];
                    },
                    error:function (msg) {
                        alert("数据插入失败");
                        $("#input-submit-xuetang").removeAttr("disabled");
                        infoJsonXueTang = {};
                        infoArrXueTang = [];
                    }
                });
            });

            // delete input
            $("#completion-tbl,#completion-tbl-xuetang").on("click","button", function () {
                console.log("click");
                var row = $(this).parent().parent();
                var id = row.attr("id");
                $.ajax({
                    type:"POST",
                    url:"delinfo",
                    data:JSON.stringify({"id":id}),
                    datatype:"application/json",
                    success:function (msg) {
                        var msgobj = JSON.parse(msg);
                        console.log(msgobj);
                        row.remove();

                    },
                    error:function (msg) {
                        alert("删除失败,请稍后再试");
                    }
                })

            });

 });

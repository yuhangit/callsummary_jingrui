 $(document).ready(function () {
            var infoArr = [],
            infoJson = {};
            // check input information
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
                var subject = matched_reg[3];
                var grade = matched_reg[4];
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
                        "dt":dt.utc().format("YYYY-MM-DD HH:mm:ss"),
                        "station":station,
                        "src_phone":src_phone,
                        "district":district,
                        "subject":subject,
                        "grade":grade,
                        "name":name,
                        "phone":phone,
                        "remark":remark
                    };
                    infoArr.push(dt.local().format("YYYY-MM-DD HH:mm:ss"),station,src_phone,district,subject,grade,name,phone,remark);
                }
            });

            // submit input
            $("#input-submit").on("click", function () {
                //console.log("click");
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
                        $("#input-submit").removeAttr("disabled");
                    },
                    error:function (msg) {
                        alert("数据插入失败");
                        $("#input-submit").removeAttr("disabled");
                    }
                });

            });

            // delete input
            $("#completion-tbl").on("click","button", function () {
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

            })
        })
var app = angular.module("myapp", ["ngRoute", "ngCookies"]);

app.controller("subject", function ($scope, $http, $rootScope) {
  $scope.subjects = [];
  $http.get("../db/Subjects.js").then(function (response) {
    $scope.subjects = response.data;
    $scope.begin = 0;
    $scope.pageCount = Math.ceil($scope.subjects.length / 4);

    $scope.first = function () {
      $scope.begin = 0;
    };

    $scope.prev = function () {
      if ($scope.begin > 0) {
        $scope.begin -= 4;
      }
    };

    $scope.next = function () {
      if ($scope.begin < ($scope.pageCount - 1) * 4) {
        $scope.begin += 4;
      }
    };

    $scope.last = function () {
      $scope.begin = ($scope.pageCount - 1) * 4;
    };
  });
});

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "../layout/home.html",
    })
    .when("/gioi-thieu", {
      templateUrl: "../layout/gioithieu.html",
    })
    .when("/Subjecks", {
      templateUrl: "../layout/Subjecks.html",
    })
    .when("/lien-he", {
      templateUrl: "../layout/lienhe.html",
    })
    .when("/gop-y", {
      templateUrl: "../layout/gopy.html",
    })
    .when("/gioi-thieu", {
      templateUrl: "../layout/gioithieu.html",
    })
    .when("/hoi-dap", {
      templateUrl: "../layout/hoidap.html",
    })
    .when("/dang-ky", {
      templateUrl: "../layout/dangky.html",
      controller: "mylogin",
    })
    .when("/dang-nhap", {
      templateUrl: "../layout/dangnhap.html",
      
    })
    .when("/dang-xuat", {
      templateUrl: "../layout/dang-xuat.html",
      controller: "dangxuat",
    })
    .when("/quen-mat-khau", {
      templateUrl: "../layout/quenmatkhau.html",
      controller: "mylogin",
    })
    .when("/doi-mat-khau", {
      templateUrl: "../layout/doimatkhau.html",
      controller: "mylogin",
    })
    .when("/cap-nhap-tai-khoan", {
      templateUrl: "../layout/capnhaptaikhoan.html",
      controller: "mylogin",
    })

    .when("/mon-hoc/:id/:name", {
      templateUrl: "../layout/mon-hoc.html",
      resolve: {
        check: function ($location, $rootScope) {
          if (!$rootScope.logendIn) {
            $rootScope.keySearch = "";
            $location.path("/dang-nhap");
          }
        },
      },
      controller: "monhoc",
    })

    .when("/dashboard", {
      templateUrl: "../layout/dashboard/dashboard.html",
      resolve: {
        check: function ($location, $rootScope) {
          if (!$rootScope.logendIn) {
            $location.path("/dang-nhap");
          }
        },
      },
    })

    .when("/test/:id/:name", {
      templateUrl: "../layout/quizs/Quiz.html?" + Math.random(),
      resolve: {
        check: function ($location, $rootScope) {
          if (!$rootScope.logendIn) {
            $location.path("/dang-nhap");
          }
        },
      },
      controller: "TESTsTAST",
    });
});

app.controller("dangxuat", function ($scope, $rootScope) {
  $scope.logoutacc = function () {
    $rootScope.logendIn = false;
    $rootScope.username = "";
    $rootScope.password = "";
    $rootScope.fullname = "";
    $rootScope.email = "";
    $rootScope.birthday = "";
    $rootScope.gender = "";
    window.location.href = "http://127.0.0.1:5500/index.html#!/dang-nhap";

    $rootScope.usercook = "";
  };
});

app.controller("TESTsTAST", function (
  $scope,
  $http,
  $rootScope,
  $routeParams,
  $interval,
  $window,
  $location
) {
  $scope.time = 30;

  $interval(function () {
    $scope.time--;
    $scope.phantramthoigian = ($scope.time * 100) / 30;
    $scope.mau = "bg-success";
    if ($scope.phantramthoigian < 50) {
      $scope.mau = "bg-warning";
    }
    if ($scope.phantramthoigian < 10) {
      $scope.mau = "bg-danger";
    }
    if ($scope.time == 0) {
      $scope.answerOver = true;
    }
  }, 1000);

  $http.get("../db/Quizs/" + $routeParams.id + ".js").then(function (response) {
    $scope.myWelcome = response.data;    
    $scope.begn = 0;
    $scope.pageCount = Math.ceil($scope.myWelcome.length / 1);
    $scope.tennghanh = $routeParams.name;
    $scope.diem = 0;
    $scope.answerMode = true;
    $scope.answerOver = false;
    $scope.overGame = function () {
      $scope.answerOver = true;
    };
    $scope.reset = function () {
      window.location.href =
        "http://127.0.0.1:5500/index.html#!/mon-hoc/" +
        $routeParams.id +
        "/" +
        $routeParams.name;
    };
    $scope.nextt = function () {
      $scope.answerMode = true;
      if ($scope.begn < $scope.pageCount - 1) {
        $scope.begn += 1;
      } else {
        $scope.answerOver = true;
      }
    };

    ////////////////////////////////////

    $scope.checkcau = function () {
      $scope.Onecaudung = (1 * 10) / $scope.pageCount;
      if (!$("input[name = answerw]:checked").length) return;
      var ans = $("input[name = answerw]:checked").val();

      var AnswerId = $("input[name = AnswerId]").val();

      if (ans == AnswerId) {
        $scope.diem = $scope.diem + $scope.Onecaudung;

        $scope.stud = {
          NameSubject: $scope.tennghanh,
          username: $rootScope.username,
          fullname: $rootScope.fullname,
          correct: ($scope.diem * $scope.pageCount) / 10,
          incorrect: $scope.pageCount - ($scope.diem * $scope.pageCount) / 10,
          marks: $scope.diem,
        };

        $scope.answerMode = true;
      } else {
        $scope.answerMode = true;
      }
      $scope.answerMode = false;
    };

    ///////////////Lưu thông tin bài làm //////////////////////

    $scope.stu = [];

    if ($window.sessionStorage.getItem("task") == null) {
      $window.sessionStorage.setItem("task", JSON.stringify($scope.stu));
    }
    var tas = JSON.parse($window.sessionStorage.getItem("task"));
    $rootScope.datas = tas;

    $scope.saveTask = function () {
      tas.push(angular.copy($scope.stud));
      $window.sessionStorage.setItem("task", JSON.stringify(tas));
      window.location.href = "http://127.0.0.1:5500/index.html#!/";
      alert("Chúc mừng bạn lưu dữ liệu thành công thành công !");
    };

    ////////////////////////
  });
});

app.controller("monhoc", function ($scope, $routeParams, $rootScope) {
  $scope.mon = $routeParams.id;
  $scope.keySearch = "";
  $scope.name = $routeParams.name;
  $rootScope.messenger = true;
});
//-----------------------------------

//-----------------------------------

app.controller("mylogin", function (
  $scope,
  $location,
  $http,
  $rootScope,
  $window
) {
  $http.get("../db/Students.js").then(function (response) {
    $scope.students = response.data;
    //
    if ($window.sessionStorage.getItem("account") == null) {
      $window.sessionStorage.setItem(
        "account",
        JSON.stringify($scope.students)
      );
    }
    var acc = JSON.parse($window.sessionStorage.getItem("account"));

    //Đăng nhập
    $scope.login = function () {
      for (var i = 0; i < acc.length; i++) {
        if (
          acc[i].username == $scope.dnusername &&
          acc[i].password == $scope.dnpassword
        ) {
          $location.path("/");
          $rootScope.username = acc[i].username;
          $rootScope.password = acc[i].password;
          $rootScope.fullname = acc[i].fullname;
          $rootScope.email = acc[i].email;
          $rootScope.birthday = acc[i].birthday;
          $rootScope.gender = acc[i].gender;
          $window.sessionStorage.setItem("fullname", $rootScope.fullname);
          $rootScope.usercook = $window.sessionStorage.getItem("fullname");
          $rootScope.logendIn = true;
          break;
        }
      }
      if (!$rootScope.logendIn) {
        alert("Tên tài khoản và mật khẩu không chính xác !");
      }
    };

    //Đăng ký

    $scope.register = function () {
      for (var i = 0; i < acc.length; i++) {
        if (acc[i].username != $scope.student.username) {
          $rootScope.success = true;
        } else {
          $rootScope.success = false;
        }
      }
      if ($rootScope.success == true) {
        acc.push(angular.copy($scope.student));
        $window.sessionStorage.setItem("account", JSON.stringify(acc));
        alert("Bạn đã đăng ký tài khoản thành công !");
        $location.path("/dang-nhap");
      } else {
        if ($scope.student.password == $scope.student.confirm_password) {
          alert("Tài khoản đã tồn tại ");
        } else {
          alert("Mật khẩu xác nhận không đúng !");
        }
      }
    };
    //Cập nhập tài khoản
    for (var i = 0; i < acc.length; i++) {
      if ($rootScope.username == acc[i].username) {
        $scope.student = angular.copy(acc[i]);
        break;
      }
    }

    console.log($scope.student);

    $scope.update = function () {
      for (var i = 0; i < acc.length; i++) {
        if ($rootScope.username == acc[i].username) {
          acc[i] = angular.copy($scope.student);
          $window.sessionStorage.setItem("account", JSON.stringify(acc));
          $rootScope.username = acc[i].username;
          $rootScope.password = acc[i].password;
          $rootScope.fullname = acc[i].fullname;
          $rootScope.email = acc[i].email;
          $rootScope.birthday = acc[i].birthday;
          $rootScope.gender = acc[i].gender;
          alert("Cập nhật tài khoản thành công !");
        }
      }
    };
    //Cập nhập mật khẩu
    $scope.updatePassword = function () {
      for (var i = 0; i < acc.length; i++) {
        if ($rootScope.username == acc[i].username) {
          acc[i] = angular.copy($scope.student);
          $window.sessionStorage.setItem("account", JSON.stringify(acc));
          $rootScope.username = acc[i].username;
          $rootScope.password = acc[i].password;
          $rootScope.fullname = acc[i].fullname;
          $rootScope.email = acc[i].email;
          $rootScope.birthday = acc[i].birthday;
          $rootScope.gender = acc[i].gender;
          window.location.href = "http://127.0.0.1:5500/index.html#!/";
          alert("Thay đổi mật khẩu thành công !");
        }
      }
    };
    //Tìm mật khẩu
    $scope.checkEmail = function () {
      $scope.checmai = false;
      for (var i = 0; i < acc.length; i++) {
        if ($scope.vvvemail == acc[i].email) {
          $scope.checmai = true;
          $scope.us = acc[i].username;
          $scope.pa = acc[i].password;
        }
      }

      if (!$scope.checmai) {
        alert("Nhập Email không tồn tại !");
      }
    };
  });
});

app.controller("saveTaskss", function ($scope, $rootScope, $http, $window) {
  ///Lưu kết quả làm bài

  $scope.students = [
    {
      NameSubject: "Lập trình Android nâng cao",
      username: "teonv",
      fullname: "Nguyễn Văn Tèo",
      correct: "0",
      incorrect: "0",
      marks: "0",
    },
    {
      NameSubject: "Lập trình Android nâng cao",
      username: "pheonv",
      fullname: "Nguyễn Văn Chí Phèo",
      correct: "0",
      incorrect: "0",
      marks: "0",
    },
  ];

  if ($window.sessionStorage.getItem("task") == null) {
    $window.sessionStorage.setItem("task", JSON.stringify($scope.students));
  }
  var tas = JSON.parse($window.sessionStorage.getItem("task"));
  $rootScope.datas = tas;

  $scope.student = {
    NameSubject: $scope.NameSubject,
    username: $scope.username,
    fullname: $scope.fullname,
    correct: $scope.correct,
    incorrect: $scope.incorrect,
    marks: $scope.mark,
  };

  $scope.saveTassk = function () {
    tas.push(angular.copy($scope.student));
    $window.sessionStorage.setItem("task", JSON.stringify(tas));
    alert("Chúc mừng bạn lưu dữ liệu thành công thành công !");
  };
});

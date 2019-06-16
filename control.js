$.fn.extend({
	//日历控件
	calendar: function (options) { //日历
		var _this = $(this);
		var defaults = { //初始属性
			date: new Date(),  //初始时间
			topWeekShow: true, //是否显示周几
			ifSwitch: true, // 是否能切换月份
			hoverDate: true, // hover是否显示当天信息
			dayClick: function (arg) { //天数的点击事件

			},

		};
		options = $.extend(defaults, options);

		function timeToSort(times, type) { //标准格式转yy-mm-dd
			var de = new Date(times);
			var desY = de.getFullYear();
			var desM = (de.getMonth() + 1);
			var desD = de.getDate();
			if (desM > 9) {
				desM = desM;
			} else {
				desM = "0" + desM;
			}
			if (desD > 9) {
				desD = desD;
			} else {
				desD = "0" + desD;
			}
			if (type == "ymd") {
				var des = desY + "-" + desM + "-" + desD;
			} else if (type == "ym") {
				var des = desY + "/" + desM;
			} else if (type == "d") {
				var des = desD;
			}
			return des;
		}

		function weekToInitial(times) { //返回星期几
			var de = new Date(times);
			var week = de.getDay() + 1;
			switch (week) {
				case 1:
					week = "Sun"; //日
					break;
				case 2:
					week = "Mon"; //一
					break;
				case 3:
					week = "Tue"; //二
					break;
				case 4:
					week = "Wed"; //三
					break;
				case 5:
					week = "Thu"; //四
					break;
				case 6:
					week = "Fri"; //五
					break;
				case 7:
					week = "Sat"; //六
					break;
			}
			return week;
		}

		function weekToOneDay(times) { //当前时间的一号为周几
			var de = new Date(times);
			var desY = de.getFullYear();
			var desM = (de.getMonth() + 1);
			var des = desY + "-" + desM + "-01";
			var week = (new Date(des).getDay()); //如week = 3 则x月一号为周三 也就是说一号到日历一行一列的周日有3天
			return week;
		}

		function getCountDays(times) { /* 返回当月的天数 */
			var curDate = new Date(times);
			/* 获取当前月份 */
			var curMonth = curDate.getMonth();
			/*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
			curDate.setMonth(curMonth + 1);
			/* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
			curDate.setDate(0);
			/* 返回当月的天数 */
			return curDate.getDate();
		}

		function lastMonthArrRetrun(times, days) { /* 返回上个月的末尾几天 */
			var de = new Date(times);
			var desY = de.getFullYear();
			var desM = ((de.getMonth() + 1) - 1);
			if (desM == 0) {
				desY--;
				desM = 12;
			}
			var des = desY + "-" + desM + "-01";
			var lastDay = getCountDays(des);
			var arr = [];
			for (days; days > 0; days--) {
				arr.push(desY + "-" + desM + "-" + lastDay);
				lastDay--;
			}
			return arr.sort();
		}

		function dayArr(times, num, type) {
			var de = new Date(times);
			var desY = de.getFullYear();
			if (type == 0) {
				var desM = de.getMonth() + 1;
			} else if (type == 1) {
				var desM = de.getMonth() + 2;
				if (desM == 13) {
					desY++;
					desM = 1;
				}
			}
			var arr = [];
			for (let i = 0; i < num; i++) {
				arr.push(desY + "-" + desM + "-" + (i + 1))
			}
			return arr
		}

		function hoverDateShow(times, top, left) {
			$(".cl_window_thisday").show();
			$(".cl_window_date").html(timeToSort(new Date(times), 'ymd'));
			$(".cl_window_thisday").css("top", top);
			$(".cl_window_thisday").css("left", left);
		}

		function monthDay(times) {
			$(".cl_allDays").html(" ");
			var lastDays = weekToOneDay(times); //本月一号周几 - 第一行周日的天数
			var lastMonthArr = lastMonthArrRetrun(times, lastDays);
			var days = getCountDays(timeToSort(times, 'ym')); //本月有多少天
			var monthArr = dayArr(times, days, 0); //本月的天数
			var nextDays = 42 - days - lastDays; //最后几天
			var nextMonthArr = dayArr(times, nextDays, 1);
			var allArr = lastMonthArr.concat(monthArr).concat(nextMonthArr);
			var htmlMonthStr = '';
			var today = timeToSort(new Date(), 'd');
			var cout = 0; //计数
			for (let i = 0; i < 6; i++) { //6行
				for (let j = 0; j < 7; j++) { //7列
					var isToday = '',
						isThisMonthDay = '';
					if (j == 0) { //第一列 
						htmlMonthStr += `<div class="cl_down_row">`;
					};
					if (cout < lastDays) { //是否是上月的日子
						isThisMonthDay = " cl_day_noThisMonth";
					} else if (cout >= (lastDays + days)) { //是否是下月的日子
						isThisMonthDay = " cl_day_noThisMonth";
					} else if (cout == (lastDays + today - 1)) { //是否是今天
						if (timeToSort(new Date(allArr[cout]), 'ymd') == timeToSort(new Date(), 'ymd')) {
							isToday = " cl_today";
						}
					}
					htmlMonthStr += `<div class="cl_day` + isToday + isThisMonthDay + `" data="` + allArr[cout] + `">` + (allArr[cout].substr(allArr[cout].length - 2)).replace('-', "") + `</div>`;
					if (j == 6) { //最后一列
						htmlMonthStr += `</div>`;
					};
					cout++;
				}
			}
			return htmlMonthStr;
		}

		function createCalendar(times) {
			var htmlString = `
		<div class="cl_all">
			<div class="cl_top">
				<div class="cl_top_title">` + timeToSort(times, "ym") + `</div>
				<div class="cl_top_box">
					<div class="cl_top_week">` + weekToInitial(new Date()) + `</div>
					<span class="cl_top_left arrow">
						<</span> <span class="cl_top_right arrow">>
					</span>
				</div>
			</div>
			<div class="cl_down">
				<div>
					<div class="cl_down_week">
						<div>日</div>
						<div>一</div>
						<div>二</div>
						<div>三</div>
						<div>四</div>
						<div>五</div>
						<div>六</div>
					</div>
				</div>
				<div class="cl_allDays">
					` + monthDay(times) +
				`</div>
			</div>
		</div>
		<div class="cl_window_thisday" style="opacity: 1;">
				<i class="cl_window_triangle"></i>
				<p class="cl_window_date"></p>
		</div>`
			_this.html(htmlString);
		}

		createCalendar(options.date);

		if (!options.ifSwitch) {
			$(".arrow").hide();
		}

		if (!options.topWeekShow) {
			$(".cl_top_week").hide();
		}

		_this.find('.cl_top_left').click(function () { //点击cl_top_left
			var de = new Date($(".cl_top_title").html() + "/01");
			var desY = de.getFullYear();
			var desM = ((de.getMonth() + 1) - 1);
			if (desM == 0) {
				desY--;
				desM = 12;
			}
			if (desM == 13) {
				desY++;
				desM = 1;
			}
			if (desM > 9) {
				desM = desM;
			} else {
				desM = "0" + desM;
			}
			var des = desY + "-" + desM + "-01";
			$(".cl_top_title").html(desY + "/" + desM);
			$(".cl_allDays").html(monthDay(des));
		})

		_this.find('.cl_top_right').click(function () { //点击cl_top_left
			var de = new Date($(".cl_top_title").html() + "/01");
			var desY = de.getFullYear();
			var desM = ((de.getMonth() + 1) + 1);
			if (desM == 0) {
				desY--;
				desM = 12;
			}
			if (desM == 13) {
				desY++;
				desM = 1;
			}
			if (desM > 9) {
				desM = desM;
			} else {
				desM = "0" + desM;
			}
			var des = desY + "-" + desM + "-01";
			$(".cl_top_title").html(desY + "/" + desM);
			$(".cl_allDays").html(monthDay(des));
		})

		$(".cl_top_week").click(function () {
			$(".cl_top_title").html(timeToSort(new Date(), "ym"));
			$(".cl_allDays").html(monthDay(new Date()));
		})

		$(".cl_allDays").on("click", ".cl_day", function (arg) { //点击事件
			$('.cl_day.cl_day_click').removeClass("cl_day_click");
			$(this).addClass("cl_day_click");
			options.dayClick($(this), $(this).attr("data"));
		})

		$(".cl_allDays").on("mouseenter", ".cl_day", function (arg) { //鼠标移来事件
			if (!options.hoverDate) { return };
			var tops = ($(this).offset().top - 5) + "px";
			var lefts = ($(this).offset().left + 60) + "px";
			var times = $(this).attr("data");
			hoverDateShow(times, tops, lefts);
		})

		$(".cl_allDays").on("mouseleave", ".cl_day", function (arg) { //鼠标移走事件
			if (!options.hoverDate) { return }
			$(".cl_window_thisday").hide();
		})


		var fn = {

		}

		return fn; //返回提供的方法
	}
});
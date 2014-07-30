<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
	
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	
	<script src="js/third-party/underscore.js"></script>
	<script src="js/third-party/Snowball.js"></script>
	
	<script src="js/main.coffee"
                type="text/coffeescript" charset="UTF-8"></script>
	<script src="js/third-party/coffee-script.js"></script>
	
	<script src="js/third-party/mustache.js"></script>
	<script src="js/third-party/jquery.min.js"></script>
	<script src="js/test.js"></script>
	
</head>
<body>

	<p>Это для генерации текста. Пример не имеет отношения к логике.</p>
	
	<textarea id="template" style="display:none;">
		<style>
			td {
				border:1px solid black;
				padding:0.5em;
			}
			td.info {
				/*border:none;*/
				padding:0.5em;
			}
		</style>
		<table>
			<tr>
				<td>Есть Кто? Что?</td>
				<td>Нет Кого? Чего?</td>
				<td>Давать Кому? Чему?</td>
				<td>Винить Кого? Что?</td>
				<td>Доволен Кем? Чем?</td>
				<td>Думать О ком? О чем?</td>
				<td class="info">Склонение</td>
				<td class="info">Род</td>
			</tr>
			{{#items}}
				<tr>
					{{#wordForms}}
						{{#failure}}<td style="background-color:#ff8080;">{{/failure}}
						{{#ok}}<td style="background-color:#d5ffe6;">{{/ok}}
							{{actual}}
						</td>
					{{/wordForms}}
					<td class="info" style="{{#dColor}} background-color:{{dColor}}; {{/dColor}}">
						{{declension}}
					</td>
					<td class="info" style="{{#genderColor}} background-color:{{genderColor}}; {{/genderColor}}">
						{{gender}}
					</td>
				</tr>
			{{/items}}
		</table>
	</textarea>
	<!--<input type="button" onclick="main()" value="Тест"/>-->
	<div id="stats" style="font-size:50px;font-family:Georgia;margin-bottom:0.5em;"></div>
	<div id="result"></div>
	
</body>
</html>
var fs = require('fs');

//react native布局标签
var RNtag = [
	'ActivityIndicator',
	'Button',
	'DatePickerIOS',
	'DrawerLayoutAndroid',
	'Image',
	'KeyboardAvoidingView',
	'ListView',
	'ListView.DataSource',
	'MapView',
	'Modal',
	'Navigator',
	'NavigatorIOS',
	'Picker',
	'PickerIOS',
	'ProgressBarAndroid',
	'ProgressViewIOS',
	'RefreshControl',
	'ScrollView',
	'SegmentedControlIOS',
	'Slider',
	'StatusBar',
	'Switch',
	'TabBarIOS',
	'TabBarIOS.Item',
	'Text',
	'TextInput',
	'ToolbarAndroid',
	'TouchableHighlight',
	'TouchableNativeFeedback',
	'TouchableOpacity',
	'TouchableWithoutFeedback',
	'View',
	'ViewPagerAndroid',
	'WebView'
];

//读取html文件夹的所有文件
readdir('../html',function(filename){
	fs.readFile(filename, function(err,data){
		if(err){console.log(err+'\n44');return}
		data = data.toString();

		//得到页面布局
		var viewText = data.match(/<!--布局start-->[\s\S]*<!--布局end-->/g)[0].replace(/class="[A-Za-z0-9 ]+"/g,function(part){
			var str = 'style={';
			part = part.split('class="')[1].replace(/"/,'').split(' ');
			if(part.length===1){
				str += 'styles.'+part[0];
			}else{
				str += '[';
				part.forEach(function(item){
					str += 'styles.'+item+',';
				});
				str = str.replace(/,$/,'')+']';
			}
			return str + '}';
		}).replace(/<br>|<br\/>/g,'{"\\n"}').replace(/<!--布局start-->|<!--布局end-->/g,'')
		.replace(/src="[\w \.-\/]+"/g,function(part){
			part = part.replace(/src=|"/g,'');
			if(part.indexOf('http://')>=0||part.indexOf('https://')>=0){
				return 'source={{uri:"'+part+'"}}'
			}else{
				return 'source={require("'+part+'")}';
			}
		});
		//console.log(viewText);
		//return

		//得到样式
		var styleText = data.match(/<style id="style">[\s\S]*<\/style>/)[0].replace(/\s+|<style id="style">|<\/style>/g,'');
		styleText = styleText.replace(/^./,'')
		.replace(/\{/g,':{\n	')
		.replace(/;/g,',\n	')
		.replace(/\}./g,'\n},\n')
		.replace(/\}$/,'\n}')
		.replace(/\dpx/g,function(part){
			return part.replace('px','');
		})
		.replace(/-[a-z]/g,function(part){
			return part.match(/[a-z]$/)[0].toLocaleUpperCase();
		})
		.replace(/\:[\w\d #]+,/g,function(part){
			var value = part.replace(/:|,/g,'');
			if(isNaN(parseInt(value))){

				return ':"'+value+'",';
			}else{
				return part;
			}
		})
		.replace(/rgb.*\([\d,\.]+\)/g,function(part){
			return '"'+part+'"';
		});
		//console.log(styleText);
		//return

		//生成需要import的组件
		var importText = "import {\n	StyleSheet,\n";
		RNtag.forEach(function(tagname){
			if(viewText.indexOf(tagname)>=0)
			importText += '	'+tagname+',\n';
		});
		importText = importText.replace(/,\n$/,'\n')+"} from 'react-native';";
		//console.log(importText);

		//判断是否有对应的js文件
		var jsfile = filename.replace(/^\.\.\/html/,'../jsx').replace(/\.html$/,'.js');
		fs.exists(jsfile,function(exists){
			if(exists){
				//如果存在，更新它
				updateJS({
					filename:jsfile,
					importText:importText,
					viewText:viewText,
					styleText:styleText
				});
			}else{
				//如果不存在，创建它
				createJS({
					filename:jsfile,
					importText:importText,
					viewText:viewText,
					styleText:styleText
				});
			}
		});
	});
});

//读取文件夹
function readdir(path,ondata){
	function __read__(path){
		fs.readdir(path,function(err,files){
			if(err){console.log(err+'\n115');return}
			files.forEach(function(filename){
				if(filename==='.'&&filename==='..')return;
				filename = path+'/'+filename;

				fs.stat(filename,function(err,stats){
					if(err){console.log(err+'\n121');return}
					if(stats.isDirectory()){
						__read__(filename);
					}else if(stats.isFile()){
						ondata(filename);
					}
				})
			});
		});
	}__read__(path);
}

//更新js文件
function updateJS(obj){
	fs.readFile(obj.filename, function(err,data){
		if(err){console.log(err+'\n153');return}
		data = data.toString();
		data = data.replace(/\/\*__布局用到的tag__\*\/[\s\S]*\/\*__布局用到的tag__\*\//g,'/*__布局用到的tag__*/\n'+obj.importText+'\n/*__布局用到的tag__*/')
		.replace(/\/\*__布局__\*\/[\s\S]*\/\*__布局__\*\//g,'/*__布局__*/\n'+obj.viewText+'\n/*__布局__*/')
		.replace(/\/\*__样式__\*\/[\s\S]*\/\*__样式__\*\//g,'/*__样式__*/\n'+obj.styleText+'\n/*__样式__*/');
		fs.writeFile(obj.filename,data,function(err){
			if(err)console.log(err+'\n160');
		});
	});
}

//创建js文件
function createJS(obj){

	//添加import
	var data = "import React, {Component} from 'react';\n/*__布局用到的tag__*/";
	data += obj.importText;

	//添加view
	data += '\n/*__布局用到的tag__*/\n\nexport default class 需要自定义一个变量名 extends Component{\n	render(){\n\n		return (\n			/*__布局__*/\n';
	data += obj.viewText;
	data += '\n			/*__布局__*/\n		);\n	}\n}';

	//添加style
	data += '\n\nconst styles = StyleSheet.create({\n/*__样式__*/\n';
	data += obj.styleText + '\n/*__样式__*/});';

	//看看是否有这么一个目录，没有的话就创建
	var _hasD_ = -1;//计数，如果在根目录，则为0
	function hasD(Dname,sDname,callback){
		_hasD_++;
		fs.exists(Dname,function(exists){
			if(!exists){
				hasD(Dname.replace(/\/[\w\d-\.]+$/,''),Dname,function(){
					if(sDname)
					fs.mkdir(sDname,function(err){
						if(err){console.log(err+'\n180');return};
						_hasD_--;
						if(_hasD_===0)writeFile();
					});
					else{
						_hasD_--;
						console.log(_hasD_);
						if(_hasD_===0)writeFile();
					}
				});
			}else{
				if(sDname)
				fs.mkdir(sDname,function(err){
					if(err){console.log(err+'\n176');return};
					_hasD_--;
					if(_hasD_===0)writeFile();
					if(callback)
					callback();
				});
				else{
					_hasD_--;
					if(_hasD_===0)writeFile();
				}
			}
		});
	}
	hasD(obj.filename.replace(/\/[\w\d-\.]+\.js$/,''));

	function writeFile(){
		console.log(111);
		fs.writeFile(obj.filename,data,function(err){
			if(err)console.log(err+'\n218');
		});
	}
}

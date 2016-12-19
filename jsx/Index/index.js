import React, {Component} from 'react';
/*__布局用到的tag__*/import {
	StyleSheet,
	Image,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
/*__布局用到的tag__*/

export default class 需要自定义一个变量名 extends Component{
	render(){

		return (
			/*__布局__*/

<View style={styles.layout}>
	<View style={styles.header}>
		<View style={styles.Htitle}>
			<Text style={styles.title}>个人中心</Text>
		</View>
		<View style={styles.Himg}>
			<View style={styles.HIbox}>
				<Image style={styles.HIimg} source={require("../../images/header_tou_f.png")}/>
			</View>
			<TouchableOpacity style={styles.HIsignin} activeOpacity={0.8}>
				<Text style={styles.HIStxt}>签到</Text>
			</TouchableOpacity>
		</View>
	</View>
	<View style={styles.recharge}>
		<Text style={[styles.ff,styles.RCtxt]}>¥</Text>
		<Text style={styles.RCtxt}> 充值</Text>
	</View>
</View>

			/*__布局__*/
		);
	}
}

const styles = StyleSheet.create({
/*__样式__*/
layout:{
	flex:1,
	backgroundColor:"#f5f5f5",
	
},
header:{
	backgroundColor:"#64a8fd",
	paddingBottom:20,
	
},
Htitle:{
	justifyContent:"center",
	height:44,
	
},
title:{
	textAlign:"center",
	color:"#FFF",
	fontSize:17,
	
},
Himg:{
	flexDirection:"row",
	justifyContent:"center",
	alignItems:"center",
	paddingLeft:70,
	/*((80+20+50)/2-40)*2*/
},
HIbox:{
	width:84,
	height:84,
	borderRadius:42,
	borderWidth:4,
	borderColor:"rgba(255,255,255,0.5)",
	
},
HIimg:{
	width:76,
	height:76,
	margin:0,
	borderRadius:38,
	borderWidth:4,
	borderColor:"#FFF",
	
},
HIsignin:{
	marginLeft:20,
	backgroundColor:"#FB7B54",
	height:25,
	width:50,
	borderRadius:12.5,
	justifyContent:"center",
	
},
HIStxt:{
	textAlign:"center",
	color:"#FFF",
	
},
ff:{
	fontFamily:'dkapp',
	
},
recharge:{
	position:"absolute",
	right:10,
	top:136,
	width:60,
	height:25,
	backgroundColor:"#477fc4",
	borderRadius:12.5,
	flexDirection:"row",
	justifyContent:"center",
	alignItems:"center",
	
},
RCtxt:{
	textAlign:"center",
	fontSize:12,
	color:"#FFF",
	
}
/*__样式__*/});
import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList} from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyReceivedThingssScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      receivedThingsList : []
    }
  this.requestRef= null
  }

  getReceivedThingsList =()=>{
    this.requestRef = db.collection("requested_things")
    .where('user_id','==',this.state.userId)
    .where("thing_status", '==','received')
    .onSnapshot((snapshot)=>{
      var receivedThingsList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedThingsList : receivedThingsList
      });
    })
  }

  componentDidMount(){
    this.getReceivedThingsList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    console.log(item.thing_name);
    return (
      <ListItem
        key={i}
        title={item.thing_name}
        subtitle={item.thingStatus}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Received Things" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receivedThingsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Received Things</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receivedThingsList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})


/// routing 

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('welcome', {
    to:"main"
  });
});

Router.route('/items', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('items', {
    to:"main"
  });
});

Router.route('/item/:_id', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('item', {
    to:"main", 
    data:function(){
      return Items.findOne({_id:this.params._id});
    }
  });
});




/// infiniscroll

Session.set("itemLimit", 8);
lastScrollTop = 0; 
$(window).scroll(function(event){
// test if we are near the bottom of the window
if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
  // where are we in the page? 
  var scrollTop = $(this).scrollTop();
  // test if we are going down
  if (scrollTop > lastScrollTop){
    // yes we are heading down...
   Session.set("itemLimit", Session.get("itemLimit") + 4);
  }

  lastScrollTop = scrollTop;
}
    
})


/// accounts config

Accounts.ui.config({
passwordSignupFields: "USERNAME_AND_EMAIL"
});

/// 


Template.items.helpers({
items:function(){
  if (Session.get("userFilter")){// they set a filter!
    return Items.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1, rating:-1}});         
  }
  else {
    return Items.find({}, {sort:{createdOn: -1, rating:-1}, limit:Session.get("itemLimit")});         
  }
},
filtering_items:function(){
  if (Session.get("userFilter")){// they set a filter!
    return true;
  } 
  else {
    return false;
  }
},
getFilterUser:function(){
  if (Session.get("userFilter")){// they set a filter!
    var user = Meteor.users.findOne(
      {_id:Session.get("userFilter")});
    return user.username;
  } 
  else {
    return false;
  }
},
getUser:function(user_id){
  var user = Meteor.users.findOne({_id:user_id});
  if (user){
    return user.username;
  }
  else {
    return "anon";
  }
}
});

Template.body.helpers({username:function(){
if (Meteor.user()){
  return Meteor.user().username;
    //return Meteor.user().emails[0].address;
}
else {
  return "anonymous internet user";
}
}
});

Template.items.events({
'click .js-item':function(event){
    $(event.target).css("width", "50px");
}, 
'click .js-del-item':function(event){
   var item_id = this._id;
   console.log(item_id);
   // use jquery to hide the item component
   // then remove it at the end of the animation
   $("#"+item_id).hide('slow', function(){
    Items.remove({"_id":item_id});
   })  
}, 
'click .js-rate-item':function(event){
  var rating = $(event.currentTarget).data("userrating");
  console.log(rating);
  var item_id = this.data_id;
  console.log(item_id);

  Items.update({_id:item_id}, 
                {$set: {rating:rating}});
}, 
'click .js-show-item-form':function(event){
  $("#item_add_form").modal('show');
}, 
'click .js-set-item-filter':function(event){
    Session.set("userFilter", this.createdBy);
}, 
'click .js-unset-item-filter':function(event){
    Session.set("userFilter", undefined);
}, 
});



Template.item_add_form.events({
'submit .js-add-item':function(event){
  var img_src, img_alt, img_category, img_OwnerPhone;

    img_src = event.target.img_src.value;
    img_alt = event.target.img_alt.value;
    img_category = event.target.img_category.value;
    img_OwnerPhone = event.target.img_OwnerPhone.value;
    console.log("src: "+img_src+" alt:"+img_alt);
    if (Meteor.user()){
      Items.insert({
        img_src:img_src, 
        img_alt:img_alt,
        img_category:img_category,
        img_OwnerPhone:img_OwnerPhone,
        img_availability: "Yes", 
        createdOn:new Date(),
        createdBy:Meteor.user()._id
      });
  }
    $("#item_add_form").modal('hide');
 return false;
}
});


// this is item_share.js
Items = new Mongo.Collection("items");

// set up security on Items collection
Items.allow({

	// we need to be able to update Items for ratings.
	update:function(userId, doc){
		console.log("testing security on item update");
		if (Meteor.user()){// they are logged in
			return true;
		} else {// user not logged in - do not let them update  (rate) the item. 
			return false;
		}
	},

	insert:function(userId, doc){
		console.log("testing security on item insert");
		if (Meteor.user()){// they are logged in
			if (userId != doc.createdBy){// the user is messing about
				return false;
			}
			else {// the user is logged in, the item has the correct user id
				return true;
			}
		}
		else {// user not logged in
			return false;
		}
	}, 
	remove:function(userId, doc){
		if (Meteor.user()){// they are logged in
			if (userId != doc.createdBy){// the user is messing about
				return false;
			}
			else {// the user is logged in, the item has the correct user id
				return true;
			}
		}
		else {// user not logged in
			return false;
		}	
	}
})





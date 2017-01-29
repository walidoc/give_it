Meteor.startup(function(){
if (Items.find().count() == 0){
	for (var i=1;i<23;i++){
		Items.insert(
			{
				img_src:"img_"+i+".jpg",
				img_alt:"image number "+i 
			}
		);	
	}// end of for insert Items
	// count the Items!
	console.log("startup.js says: "+Items.find().count());
}// end of if have no Items
});

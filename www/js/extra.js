


        function checkCheckIn(){
            console.log("In checkCheckIn!");
            var currentDate = new Date();
            var d = currentDate.toDateString();
            //Check checkin/out status
                        
                            if (company == 'virtualforce'){
                                
                               if (navigator.connection.type != Connection.NONE){
                                var query = new Parse.Query("VirtualForce");
                                query.equalTo("userPin", userpin);
                                query.startsWith("checkInTime", currentDate.toDateString());
                                query.find({
                                    success:function (results) {
                                        console.log("Results Length: " + results.length);
                                            
                                            if (results.length == 0)
                                                {
                                                    console.log("User doesnot exist!");
                                                    $('#codeOk').removeAttr('disabled');
                                                    $('#codeOk').css({'opacity':'1.4'});
                                                    $('.code-holder').val(null);
                                                }   
                                                
                                            else if (results[0].get("check") == 'checkin')
                                                {
                                                    window.location = "picUpload.html?checkin=false";
                                                }
                                            else if (results[0].get("check") == 'checkout')
                                                {
                                                    window.location = "picUpload.html?checkin=true";
                                                }
                                            else if (results[0].get("check") == '' || results[0].get("check") == null)
                                                {
                                                    window.location = "picUpload.html?checkin=true";
                                                }
                                            
                                        },
                                        error:function (error) {

                                        }
                                });
                               }
                               else if(navigator.connection.type == Connection.NONE) {
                                   it6(userpin,d);
                               }
                                 
                            }
                            else if (company == 'kualitatem'){
                                if(navigator.connection.type != Connection.NONE){
                                var query = new Parse.Query("Kualitatem");
                                query.equalTo("userPin", userpin);
                                query.startsWith("checkInTime", currentDate.toDateString());
                                query.find({
                                    success:function (results) {
                                        console.log("Results Length: " + results.length);

                                            if (results.length == 0)
                                                {
                                                    console.log("User doesnot exist!");
                                                    $('#codeOk').removeAttr('disabled');
                                                    $('#codeOk').css({'opacity':'1.4'});
                                                    $('.code-holder').val(null);
                                                }   
                                                
                                           else if (results[0].get("check") == 'checkin')
                                                {
                                                    window.location = "picUpload.html?checkin=false";
                                                }
                                            else if (results[0].get("check") == 'checkout')
                                                {
                                                    window.location = "picUpload.html?checkin=true";
                                                }
                                            else if (results[0].get("check") == '' || results[0].get("check") == null)
                                                {
                                                    window.location = "checkpicUpload.html?checkin=true";
                                                }
                                        },
                                        error:function (error) {

                                        }
                                });
                                }
                                else if(navigator.connection.type == Connection.NONE) {
                                   it(userpin,d);    
                                }
                             
                            }
            
        }
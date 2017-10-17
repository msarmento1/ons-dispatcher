////////////////////////////////////////////////
//
// Copyright (c) 2017 Matheus Medeiros Sarmento
//
////////////////////////////////////////////////

const User = require( '../../../database/models/user' );

module.exports = function ( app ) {

   app.get( '/sign_up', ( req, res ) => {

      const options = { 'title': 'Sign Up', 'active': 'sign_up' };

      res.render( 'sign_up', options );
   } );

   app.post( '/sign_up', ( req, res ) => {

      // Validation
      req.checkBody( 'name', 'Name must be between 4-50 characters long.' ).len( 4, 50 );
      req.checkBody( 'email', 'The email you entered is invalid, please try again.' ).isEmail();
      req.checkBody( 'password', 'Password must be between 8-100 characters long.' ).len( 8, 100 );
      //req.checkBody('password', 'Password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'i');
      req.checkBody( 'passwordMatch', 'Passwords do not match, please try again.' ).equals( req.body.password );

      var promise = req.getValidationResult();

      promise.then( function ( result ) {

         if ( !result.isEmpty() ) {
            var errors = result.array().map( function ( elem ) {
               return elem.msg;
            } );

            req.flash( 'error', errors.join( '\n' ) );
            res.redirect( '/' );
         } else {

            const name = req.body.name;
            const email = req.body.email;
            const password = req.body.password;
            const passwordMatch = req.body.passwordMatch;

            // Encrypt password
            User.encryptPassword( password, ( err, hash ) => {
               if ( err ) {
                  req.flash( 'error', 'An error occurred. Please try again' );
                  res.redirect( '/' );
               }

               const user = new User( { 'name': name, 'email': email, 'password': hash } );

               user.save(( err, user ) => {
                  if ( err ) {
                     if ( err.code === 11000 ) {
                        // Unique conflict
                        req.flash( 'error', 'User already exists' );
                        res.redirect( '/' );
                     }
                     else {
                        req.flash( 'error', 'An error occurred. Please try again' );
                        res.redirect( '/' );
                     }

                     return;
                  }

                  req.login( user, ( err ) => {
                     if ( err ) {
                        console.log( err );
                        return;
                     }

                     res.redirect( '/dashboard' );
                  } );
               } );
            } );
         }
      } )
   } );
}
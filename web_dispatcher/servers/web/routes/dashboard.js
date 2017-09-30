////////////////////////////////////////////////
//
// Copyright (c) 2017 Matheus Medeiros Sarmento
//
////////////////////////////////////////////////

const router = require( '../router' );
const Worker = require( '../../../database/models/worker' )

module.exports = function ( app ) {

   // dashboard
   app.get( '/dashboard', router.authenticationMiddleware(), ( req, res ) => {

      Worker.find( {}, ( err, workers ) => {

         if ( err ) {
            return console.log( err );
         }

         res.render( 'dashboard', {
            title: 'Dashboard',
            active: 'dashboard',
            workers: JSON.stringify( workers )
         })
      });
   });

   app.get( '/workers', ( req, res ) => {

      Worker.find( { lastResource: { $ne: null } },
         ( err, workers ) => {

            res.send( workers );
         });
   });

}
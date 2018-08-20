import React, { Component } from 'react'

import Splash from './splash'
import Announcement from './announcement'
import SponsorList from '../Common/sponsorlist'
//import { HistoryViewer } from '../Common/historyViewer'
import { Section } from '../PageLayout'
import YouTube from 'react-youtube' 
import { Link } from 'react-router-dom'


//import { Link } from 'react-router-dom'
export class FrontPage extends Component {
  render() {
    //Used for youtube player
    const opts = {
      height: 150,
      width: 200,
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    }
    

    return (
      <div className="page-front page">
        {<Announcement titleText="Vi har nå opptak!">
          <p>Vil du være med på et omfattende droneprosjekt? Bli med i Ascend NTNU for å utvikle en drone som skal løse en "umulig" oppgave i verdensklasse.</p>
          <Link to="join">Gå til join-siden vår for mer informasjon.</Link>
          <p style={ { color: 'yellow' } }><b>Kom på infomøte 28. august 12:15-14:15 på FRAM!</b></p>
          <p style={ { color: 'red' } }><b>Frist 2. September kl. 23:59!</b></p>
        </Announcement>}
        <Splash />
        <Section titleText="Promotional video" className="centered">
          <YouTube
            videoId="qr6UwZnJUYc"
            opts={opts}
            onReady={this._onReady}
          />
        </Section> 
        <Section titleText="Our sponsors" className="centered">
          <SponsorList />
        </Section>
      </div>
    )
  }
}

export default FrontPage

import React, { Component } from 'react'
import { polyfill } from 'es6-promise'
polyfill()

export class SponsorList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      year: props.year || 2018,
      sponsors: [],
    }

    this.getSponsors(this.state.year)
  }

  componentWillReceiveProps (nextProps) {
    let nextYear = nextProps.year || 2018
    let year = this.props.year || this.state.year

    if (nextYear !== year) {
      year = nextYear
      this.getSponsors(year)
    }
  }

  getSponsors (year) {
    fetch("/api/v1/sponsors/" + year).then(r => r.json()).then(r => {
      this.setState({
        year: year,
        sponsors: r,
      })
    })
  }

  render() {
    let sponsors = this.state.sponsors.map((sponsor, i) => {
      return (
        <div key={i} className="sponsor">
          <a href={sponsor.link} className="sponsor-adblock-link">
            <img src={sponsor.logo} alt={sponsor.name} title={sponsor.name} />
            {sponsor.logo_dark ? <img src={sponsor.logo_dark} alt={sponsor.name} title={sponsor.name} /> : null}
          </a>
          <div className="sponsor-adblock-text">
            {sponsor.short_text}
          </div>
        </div>
      )
    })

    return (
      <div className="sponsors">
        {sponsors}
      </div>
    )
  }
}

export default SponsorList

import React from 'react'
import styled from 'styled-components'

export default function Home() {
  return (
    <body>
      <StyledContainer>
        <article>
          <h1>Site is temporarily unavailable.</h1>
          <p>
            The Juno testnet is currently being upgraded. For status updates
            please visit our{' '}
            <StyledLink href="https://discord.gg/aQyfURX5GF">
              discord
            </StyledLink>
            .
          </p>
          <p></p>
        </article>
      </StyledContainer>
    </body>
  )
}

const StyledContainer = styled.div`
  text-align: center;
  padding: 10%;
  font: 20px Helvetica, sans-serif;
  display: block;
  text-align: left;
  max-width: 1000px;
  margin: 0 auto;
`

const StyledLink = styled.a`
  color: #dc8100;
  text-decoration: none;
`

import 'reflect-metadata'
import { expect } from 'chai'
import { container } from 'tsyringe'
import { EventService } from '../application/EventService'
import { Event, EventType } from '../domain/model/Event'
import { EventOutputPort } from '../domain/ports/EventOutputPort'

// Simple mock of EventOutputPort to verify broadcast calls
class MockEventOutputPort implements EventOutputPort {
  sendToUser(userId: string, arg1: { message: any }): unknown {
    console.log(userId, arg1)
    throw new Error('Method not implemented.')
  }
  public broadcastCalls: Event[] = []

  broadcastEUR(messageJson: Event): void {
    this.broadcastCalls.push(messageJson)
  }
  broadcastUSD(messageJson: Event): void {
    this.broadcastCalls.push(messageJson)
  }
}

describe('EventService', () => {
  let mockEventOutput: MockEventOutputPort
  let eventService: EventService

  beforeEach(() => {
    mockEventOutput = new MockEventOutputPort()
    container.registerInstance<EventOutputPort>('EventOutputPort', mockEventOutput)
    eventService = container.resolve(EventService)
  })

  afterEach(() => {
    // Reset container or do cleanup if necessary
    container.reset()
  })

  it('should successfully dispatch a CRYPTO_UPDATE_* event with multiple crypto data', async () => {
    const validEvent: Event = {
      eventType: EventType.CRYPTO_UPDATE_EUR,
      payload: [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
          price: 102809.0,
          marketCap: 2.03866682565e12,
          marketCapRank: 1,
          fullyDilutedValuation: 2.03866682565e12,
          totalVolume: 6.3558930111e10,
          high24h: 103369.0,
          low24h: 98970.0,
          priceChange24h: 3838.84,
          priceChangePercentage24h: 3.87881,
          marketCapChange24h: 7.6483518863e10,
          marketCapChangePercentage24h: 3.89788,
          circulatingSupply: 1.9816225e7,
          totalSupply: 1.9816225e7,
          maxSupply: 2.1e7,
          ath: 108786.0,
          athChangePercentage: -5.51654,
          athDate: '2025-01-20T09:11:54.494Z',
          atl: 67.81,
          atlChangePercentage: 151479.194,
          atlDate: '2013-07-06T00:00:00.000Z',
          lastUpdated: '2025-01-28T12:18:33.307Z',
          currency: 'usd'
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
          price: 3187.37,
          marketCap: 3.84345258778e11,
          marketCapRank: 2,
          fullyDilutedValuation: 3.84345258778e11,
          totalVolume: 2.4904416448e10,
          high24h: 3221.19,
          low24h: 3056.13,
          priceChange24h: 128.4,
          priceChangePercentage24h: 4.19762,
          marketCapChange24h: 1.5541528349e10,
          marketCapChangePercentage24h: 4.21404,
          circulatingSupply: 1.205120395899261e8,
          totalSupply: 1.205120395899261e8,
          maxSupply: null,
          ath: 4878.26,
          athChangePercentage: -34.66261,
          athDate: '2021-11-10T14:24:19.604Z',
          atl: 0.432979,
          atlChangePercentage: 736039.37952,
          atlDate: '2015-10-20T00:00:00.000Z',
          lastUpdated: '2025-01-28T12:18:41.923Z',
          currency: 'usd'
        }
      ]
    }

    await eventService.processEvent(validEvent)

    expect(mockEventOutput.broadcastCalls).to.have.lengthOf(1)
    const broadcastedEvent = mockEventOutput.broadcastCalls[0]

    // Check for properties added by CryptoUpdateHandler
    expect(broadcastedEvent.eventType).to.equal('CRYPTO_UPDATE')
    expect(broadcastedEvent).to.have.property('timestamp')

    expect(broadcastedEvent.payload).to.deep.equal(validEvent.payload)
  })

  it('should throw an error for invalid event data with empty payload', async () => {
    // Payload is empty, so it's invalid based on isValidEventData
    const invalidEvent: Event = {
      eventType: EventType.CRYPTO_UPDATE_EUR,
      payload: []
    }

    try {
      await eventService.processEvent(invalidEvent)
      expect.fail(
        'Expected processEvent to throw an error for invalid event data with empty payload'
      )
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).to.equal('Invalid event data')
      } else {
        // If the error is not an instance of Error, fail the test
        expect.fail('Thrown error is not an instance of Error')
      }
    }
  })
})

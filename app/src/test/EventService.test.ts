import 'reflect-metadata'
import { expect } from 'chai'
import { container } from 'tsyringe'
import { EventService } from '../application/EventService'
import { Event, EventType } from '../domain/model/Event'
import { EventOutputPort } from '../application/ports/EventOutputPort'

// Simple mock of EventOutputPort to verify broadcast calls
class MockEventOutputPort implements EventOutputPort {
  public broadcastCalls: Event[] = []

  broadcast(messageJson: Event): void {
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

  it('should successfully dispatch a CRYPTO_UPDATE event', async () => {
    const validEvent: Event = {
      eventType: EventType.CRYPTO_UPDATE,
      payload: [
        {
          id: 'btc-1',
          symbol: 'BTC',
          name: 'Bitcoin',
          image: 'https://example.com/btc.png',
          prices: {
            values: {
              usd: 30000,
              eur: 28000
            }
          },
          marketCap: {
            values: {
              usd: 600000000,
              eur: 560000000
            }
          },
          marketCapRank: 1,
          fullyDilutedValuation: {
            values: {
              usd: 0,
              eur: 0
            }
          },
          totalVolume: {
            values: {
              usd: 0,
              eur: 0
            }
          },
          high24h: {
            values: {
              usd: 0,
              eur: 0
            }
          },
          low24h: {
            values: {
              usd: 0,
              eur: 0
            }
          },
          priceChange24h: {
            values: {
              usd: 0,
              eur: 0
            }
          },
          priceChangePercentage24h: 0,
          marketCapChange24h: {
            values: {
              usd: 0,
              eur: 0
            }
          },
          marketCapChangePercentage24h: 0,
          circulatingSupply: 0,
          totalSupply: 0,
          maxSupply: 0,
          ath: {
            values: {
              usd: 0,
              eur: 0
            }
          },
          athChangePercentage: 0,
          athDate: '2023-01-01T00:00:00Z',
          atl: {
            values: {
              usd: 0,
              eur: 0
            }
          },
          atlChangePercentage: 0,
          atlDate: '2023-01-01T00:00:00Z',
          lastUpdated: '2023-01-01T00:00:00Z'
        }
      ]
    }

    await eventService.processEvent(validEvent)

    expect(mockEventOutput.broadcastCalls).to.have.lengthOf(1)
    const broadcastedEvent = mockEventOutput.broadcastCalls[0]

    // Check for properties added by CryptoUpdateHandler
    expect(broadcastedEvent.eventType).to.equal(EventType.CRYPTO_UPDATE)
    expect(broadcastedEvent).to.have.property('timestamp')
  })

  it('should throw an error for invalid event data', async () => {
    // Payload is empty, so it's invalid based on isValidEventData
    const invalidEvent = {
      eventType: EventType.CRYPTO_UPDATE,
      payload: []
    }

    try {
      await eventService.processEvent(invalidEvent)
      expect.fail('Expected processEvent to throw an error for invalid event data')
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

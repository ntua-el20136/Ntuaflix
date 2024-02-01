const nock = require('nock');
const { getTitleByID } = require('../../src/apiClient');
const { getToken } = require('../../src/utils/tokenStorage');

// Mocking the tokenStorage module
jest.mock('../../src/utils/tokenStorage', () => ({
  getToken: jest.fn(),
}));

describe('getTitleByID', () => {
  const baseURL = 'https://localhost:9876/ntuaflix_api';
  const token = 'validToken123';
  const titleID = 'tt0000929';
  
  beforeEach(() => {
    nock.cleanAll();
    getToken.mockReturnValue(token); // Assume a valid token is always returned
  });

  it('successfully retrieves title information in JSON format', async () => {
    const mockResponse = {
        titleObject: {
            titleID: "tt0000929",
            type: "short",
            originalTitle: "Klebolin klebt alles",
            titlePoster: null,
            startYear: "1990",
            endYear: null,
            genres: [
              { genreTitle: "Comedy" },
              { genreTitle: "Short" }
            ],
            titleAkas: [
              { akaTitle: "Willys Streiche: Klebolin klebt alles", regionAbbrev: "DE" },
              { akaTitle: "Klebolin klebt alles", regionAbbrev: null },
              { akaTitle: "Klebolin klebt alles", regionAbbrev: "DE" }
            ],
            principals: [
              { nameID: "nm0066941", name: "Ernst Behmer", category: "actor" },
              { nameID: "nm0170183", name: "Victor Colani", category: "actor"}
            ],
            rating: {
              avRating: "5.30",
              nVotes: "46"
            }
          }
        };
  
  

    nock(baseURL)
      .get(`/title/${titleID}`)
      .query({ format: 'json' })
      .matchHeader('x-observatory-auth', token)
      .reply(200, mockResponse);

    const response = await getTitleByID(titleID, 'json');
    expect(response).toEqual(mockResponse);
  });

  it('throws an error for unauthorized access', async () => {
    getToken.mockReturnValueOnce('invalidToken');
    
    nock(baseURL)
      .get(`/title/${titleID}`)
      .reply(401, { message: 'Unauthorized access' });

    await expect(getTitleByID(titleID)).rejects.toThrow('Unauthorized access');
  });

  it('throws an error if title not found', async () => {
    nock(baseURL)
      .get(`/title/${titleID}`)
      .reply(404, { message: 'Title not found' });

    await expect(getTitleByID(titleID)).rejects.toThrow('Title not found');
  });

  it('handles server error during title retrieval', async () => {
    nock(baseURL)
      .get(`/title/${titleID}`)
      .matchHeader('x-observatory-auth', token)
      .reply(500, { message: 'Internal server error during title retrieval', error: 'Database unreachable' });

    await expect(getTitleByID(titleID)).rejects.toThrow('Internal server error during title retrieval');
  });
});

// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { getMetric, IMetric } from '../../services/Metric';
import { getAuthenticated } from '../../services/Utils';

// Mock the getAuthenticated function
jest.mock('../../services/Utils', () => ({
  getAuthenticated: jest.fn(),
}));

describe('getMetric', () => {
  it('should fetch metrics and return the response data', async () => {
    const modelId = 'model-123';
    const mockMetrics: IMetric[] = [
      { id: 'metric-1', identifier: 'accuracy', key: 'acc', valueFloat: 0.95, step: 1, training: 'train-1', reporter: 'reporter-1' },
      { id: 'metric-2', identifier: 'loss', key: 'loss', valueFloat: 0.05, step: 1, training: 'train-1', reporter: 'reporter-1' },
    ];
    const mockResponse = {
      data: mockMetrics,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,  // Adjust as necessary to fit your AxiosRequestConfig type
    };

    // Mock implementation of getAuthenticated to resolve with mockResponse
    (getAuthenticated as jest.Mock).mockResolvedValue(mockResponse);

    const result = await getMetric(modelId);

    // Assertions to check if getAuthenticated was called correctly
    expect(getAuthenticated).toHaveBeenCalledWith(`/api/models/${modelId}/metrics`);

    // Assertions to check if the result is correct
    expect(result).toEqual(mockMetrics);
  });

  it('should throw an error if the API call fails', async () => {
    const modelId = 'model-123';
    const mockError = new Error('Network Error');

    // Mock implementation of getAuthenticated to reject with an error
    (getAuthenticated as jest.Mock).mockRejectedValue(mockError);

    await expect(getMetric(modelId)).rejects.toThrow('Network Error');
  });
});

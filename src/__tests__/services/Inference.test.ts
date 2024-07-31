// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { createInference } from '../../services/Inference';
import { postAuthenticated } from '../../services/Utils';

// Mock the postAuthenticated function
jest.mock('../../services/Utils', () => ({
  postAuthenticated: jest.fn(),
}));

describe('createInference', () => {
  it('should send a POST request with application/json and return the response data', async () => {
    const mockData = {
      model_id: 'mymodel',
      model_input: [
        [1.0, 2.3, -0.4, 3],
        [0.01, 9.7, 5.6, 7],
      ],
      return_format: 'json',
    };

    const mockHeaders = {
      'Content-Type': 'application/json',
    };

    const mockResponse: AxiosResponse = {
      data: { id: 1, result: 'inference_result' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: mockHeaders,
        method: 'post',
        url: '/api/inference/',
        data: mockData,
      } as InternalAxiosRequestConfig,
    };

    // Mock implementation of postAuthenticated to resolve with mockResponse
    (postAuthenticated as jest.Mock).mockResolvedValue(mockResponse);

    const result = await createInference(mockData, mockHeaders);

    // Assertions to check if postAuthenticated was called correctly
    expect(postAuthenticated).toHaveBeenCalledWith('/api/inference/', mockData, {
      headers: mockHeaders,
    });

    // Assertions to check if the result is correct
    expect(result).toEqual(mockResponse.data);
  });

  it('should send a POST request with multipart/form-data and return the response data', async () => {
    const mockData = {
      model_id: 'mymodel',
      model_input: [
        [1.0, 2.3, -0.4, 3],
        [0.01, 9.7, 5.6, 7],
      ],
      return_format: 'json',
    };

    const formData = new FormData();
    formData.append('model_id', mockData.model_id);
    formData.append('model_input', JSON.stringify(mockData.model_input));
    formData.append('return_format', mockData.return_format);

    const mockHeaders = {
      'Content-Type': 'multipart/form-data',
    };

    const mockResponse: AxiosResponse = {
      data: { id: 1, result: 'inference_result' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: mockHeaders,
        method: 'post',
        url: '/api/inference/',
        data: formData,
      } as InternalAxiosRequestConfig,
    };

    // Mock implementation of postAuthenticated to resolve with mockResponse
    (postAuthenticated as jest.Mock).mockResolvedValue(mockResponse);

    const result = await createInference(formData, mockHeaders);

    // Assertions to check if postAuthenticated was called correctly
    expect(postAuthenticated).toHaveBeenCalledWith('/api/inference/', formData, {
      headers: mockHeaders,
    });

    // Assertions to check if the result is correct
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw an error if the POST request fails', async () => {
    const mockData = {
      model_id: 'mymodel',
      model_input: [
        [1.0, 2.3, -0.4, 3],
        [0.01, 9.7, 5.6, 7],
      ],
      return_format: 'json',
    };
    const mockError = new Error('Network Error');

    // Mock implementation of postAuthenticated to reject with an error
    (postAuthenticated as jest.Mock).mockRejectedValue(mockError);

    await expect(createInference(mockData)).rejects.toThrow('Network Error');
  });
});

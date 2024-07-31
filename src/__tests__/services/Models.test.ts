// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { IModel, createModel, getModelFile, getModelMetadata, getModels } from '../../services/Models';
import { getAuthenticated, getAuthenticatedBlob, postAuthenticated } from '../../services/Utils';

// Mock the utility functions
jest.mock('../../services/Utils', () => ({
  getAuthenticated: jest.fn(),
  getAuthenticatedBlob: jest.fn(),
  postAuthenticated: jest.fn(),
}));

describe('modelFunctions', () => {
  describe('getModelFile', () => {
    it('should fetch a model file and return the data', async () => {
      const modelId = 'model-123';
      const mockBlob = new Blob(['model data'], { type: 'application/octet-stream' });
      const mockResponse = {
        data: mockBlob,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      (getAuthenticatedBlob as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getModelFile(modelId);

      expect(getAuthenticatedBlob).toHaveBeenCalledWith(`/api/models/${modelId}/`);
      expect(result).toEqual(mockBlob);
    });
  });

  describe('getModelMetadata', () => {
    it('should fetch model metadata and return the data', async () => {
      const modelId = 'model-123';
      const mockMetadata: IModel = {
        id: 'model-123',
        owner: 'owner-1',
        round: 1,
        name: 'Test Model',
        description: 'This is a test model',
      };
      const mockResponse = {
        data: mockMetadata,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      (getAuthenticated as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getModelMetadata(modelId);

      expect(getAuthenticated).toHaveBeenCalledWith(`/api/models/${modelId}/metadata/`);
      expect(result).toEqual(mockMetadata);
    });
  });

  describe('getModels', () => {
    it('should fetch all models and return the data', async () => {
      const mockModels: IModel[] = [
        { id: 'model-1', owner: 'owner-1', round: 1 },
        { id: 'model-2', owner: 'owner-2', round: 2 },
      ];
      const mockResponse = {
        data: mockModels,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      (getAuthenticated as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getModels();

      expect(getAuthenticated).toHaveBeenCalledWith(`/api/models/`);
      expect(result).toEqual(mockModels);
    });
  });

  describe('createModel', () => {
    it('should create a new model and return the data', async () => {
      const mockData = new FormData();
      mockData.append('name', 'New Model');
      const mockResponse = {
        data: { id: 'model-123', name: 'New Model' },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };

      (postAuthenticated as jest.Mock).mockResolvedValue(mockResponse);

      const result = await createModel(mockData);

      expect(postAuthenticated).toHaveBeenCalledWith('/api/models/', mockData, {
        'Content-Type': `multipart/form-data`,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  it('should throw an error if the API call fails', async () => {
    const modelId = 'model-123';
    const mockError = new Error('Network Error');

    (getAuthenticated as jest.Mock).mockRejectedValue(mockError);

    await expect(getModelMetadata(modelId)).rejects.toThrow('Network Error');
  });
});

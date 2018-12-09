import { TestBed } from '@angular/core/testing';
import { TransferState } from '@angular/platform-browser';
import { of } from 'rxjs';
import { createStubInstance, SinonStubbedInstance } from 'sinon';

import { environment } from './../../../environments/environment';
import { TransferStateService } from './transfer-state.service';

const testKey = 'test-key';
const testValue = 'test-value';
const testSource = of(testValue);

describe('TransferStateService', () => {
  let mockTransferState: SinonStubbedInstance<TransferState>;
  let transferStateService: TransferStateService;

  beforeEach(() => {
    mockTransferState = createStubInstance(TransferState);

    TestBed.configureTestingModule({
      providers: [{ provide: TransferState, useValue: mockTransferState }]
    });

    transferStateService = TestBed.get(TransferStateService);
  });

  describe('transfer', () => {
    describe('when the transferred state has the key', () => {
      it('should retrieve the transfered value', async () => {
        const transferState_hasKey = spyOn(mockTransferState, 'hasKey').and.returnValue(true);
        const transferState_get = spyOn(mockTransferState, 'get').and.returnValue(testValue);

        const transferredSource = transferStateService.transfer(testKey, testSource);

        expect(transferState_hasKey).toHaveBeenCalledWith(testKey);
        expect(transferState_get).toHaveBeenCalledWith(testKey, undefined);

        expect(await transferredSource.toPromise()).toBe('test-value');
      });

      it('should not return the original source', async () => {
        spyOn(mockTransferState, 'hasKey').and.returnValue(true);

        const transferredSource = transferStateService.transfer(testKey, testSource);

        expect(transferredSource).not.toBe(testSource);
        // tslint:disable-next-line:deprecation (this is test code)
        expect(transferredSource.source).not.toBe(testSource);
      });

      it('should remove the transfered value', () => {
        spyOn(mockTransferState, 'hasKey').and.returnValue(true);
        const transferState_remove = spyOn(mockTransferState, 'remove');

        transferStateService.transfer(testKey, testSource);

        expect(transferState_remove).toHaveBeenCalledWith(testKey);
      });
    });

    describe('when the transferred state does not have the key', () => {
      it('should wrap the original source', () => {
        const transferredSource = transferStateService.transfer(testKey, testSource);

        // tslint:disable-next-line:deprecation (this is test code)
        expect(transferredSource.source).toBe(testSource);
      });

      it('should register the value for transfer state in node', () => {
        environment.node = true;

        const transferState_onSerialize = spyOn(mockTransferState, 'onSerialize');

        transferStateService.transfer(testKey, testSource).subscribe();

        expect(transferState_onSerialize).toHaveBeenCalled();
        const [key, callback] = transferState_onSerialize.calls.first().args as [string, () => string];
        expect(key).toBe(testKey);
        expect(callback()).toBe('test-value');

        environment.node = false;
      });

      it('should not register the value for transfer state in browser', () => {
        const transferState_onSerialize = spyOn(mockTransferState, 'onSerialize');

        transferStateService.transfer(testKey, testSource).subscribe();

        expect(transferState_onSerialize).not.toHaveBeenCalled();
      });
    });
  });
});

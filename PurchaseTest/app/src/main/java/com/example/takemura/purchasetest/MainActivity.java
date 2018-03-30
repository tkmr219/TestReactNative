package com.example.takemura.purchasetest;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import com.android.billingclient.api.BillingClient.SkuType;
import com.android.billingclient.api.BillingClient.BillingResponse;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.SkuDetails;
import com.android.billingclient.api.SkuDetailsResponseListener;
import com.example.takemura.purchasetest.billing.BillingConstants;
import com.example.takemura.purchasetest.billing.BillingManager;
import com.example.takemura.purchasetest.billing.BillingManager.BillingUpdatesListener;

import java.util.List;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";

    private BillingManager mBillingManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 1. BillingManagerの初期化
        // Create and initialize BillingManager which talks to BillingLibrary
        mBillingManager = new BillingManager(this, new BillingUpdatesListener() {
            @Override
            public void onBillingClientSetupFinished() {
                //
                // 購入処理の初期化が完了
                //

                // アイテムが購入可能か問い合わせする
                final @SkuType String billingType = SkuType.INAPP;
                mBillingManager.querySkuDetailsAsync("", BillingConstants.getSkuList(billingType), new SkuDetailsResponseListener() {
                    @Override
                    public void onSkuDetailsResponse(int responseCode, List<SkuDetails> skuDetailsList) {
                        if (responseCode != BillingResponse.OK) {
                            Log.w(TAG, "Unsuccessful query for type: " + billingType  + ". Error code: " + responseCode);
                        }
                        else if (skuDetailsList != null && skuDetailsList.size() > 0) {

                            //
                            // アイテム情報の詳細を取得したので、UIに反映させるなど処理を行う
                            //


                        }
                    }
                });
            }

            @Override
            public void onConsumeFinished(String token, int result) {
                Log.d(TAG, "Consumption finished. Purchase token: " + token + ", result: " + result);

                // Note: We know this is the SKU_GAS, because it's the only one we consume, so we don't
                // check if token corresponding to the expected sku was consumed.
                // If you have more than one sku, you probably need to validate that the token matches
                // the SKU you expect.
                // It could be done by maintaining a map (updating it every time you call consumeAsync)
                // of all tokens into SKUs which were scheduled to be consumed and then looking through
                // it here to check which SKU corresponds to a consumed token.
                if (result == BillingResponse.OK) {
                    // Successfully consumed, so we apply the effects of the item in our
                    // game world's logic, which in our case means filling the gas tank a bit
                    Log.d(TAG, "Consumption successful. Provisioning.");

                } else {
                    Log.w(TAG, "Consumption error. result: " + result);

                }

                Log.d(TAG, "End consumption flow.");
            }

            @Override
            public void onPurchasesUpdated(List<Purchase> purchases) {

                //
                // 購入操作の結果
                //
                // ※もし、mBillingManager.initiatePurchaseFlow で失敗した場合は、
                // BillingManager内の、Overrideした　onPurchasesUpdated でログを出力している
                // キャンセルなど

                for (Purchase purchase : purchases) {
                    switch (purchase.getSku()) {
                        case BillingConstants.SKU_GAS:
                            // アプリ内課金アイテムの場合は、下記を実行する

                            // 3. 購入アイテムを消費する
                            mBillingManager.consumeAsync(purchase.getPurchaseToken());
                            break;
                        case BillingConstants.SKU_PREMIUM:
                            Log.d(TAG, "You are Premium! Congratulations!!!");
                            break;
                        case BillingConstants.SKU_GOLD_MONTHLY:
                            break;
                        case BillingConstants.SKU_GOLD_YEARLY:
                            break;
                    }
                }

            }
        });


        // 2. UIなどのアクションから購入処理を実行する
        // こちらのサンプルでは、skuId="gas" skyType=In_App を指定している
        mBillingManager.initiatePurchaseFlow(BillingConstants.SKU_GAS, SkuType.INAPP);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Note: We query purchases in onResume() to handle purchases completed while the activity
        // is inactive. For example, this can happen if the activity is destroyed during the
        // purchase flow. This ensures that when the activity is resumed it reflects the user's
        // current purchases.
        if (mBillingManager != null
                && mBillingManager.getBillingClientResponseCode() == BillingResponse.OK) {
            mBillingManager.queryPurchases();
        }
    }

    @Override
    public void onDestroy() {
        Log.d(TAG, "Destroying helper.");
        if (mBillingManager != null) {
            mBillingManager.destroy();
        }
        super.onDestroy();
    }

}

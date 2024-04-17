import { SubscriptionModel } from '../constants/subscriptionModel'

export const checkActiveTrial = (trialStartedAt?: Date) => {
  if (!trialStartedAt) return false
  const trialEnd = new Date(trialStartedAt)
  trialEnd.setDate(trialEnd.getDate() + 7)
  return trialEnd > new Date()
}

export const removeFreeTrial = (subscriptionModel: SubscriptionModel) => {
  return Object.keys(subscriptionModel).reduce((object, key) => {
    if (key !== 'freeTrial') {
      object[key as keyof SubscriptionModel] = subscriptionModel[key as keyof SubscriptionModel]
    }
    return object
  }, {} as SubscriptionModel)
}

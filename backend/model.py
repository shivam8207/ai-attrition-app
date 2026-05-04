from typing import Dict
import pickle
from keras.models import load_model
import numpy as np

# from config import loaded_model
def getAttrition(data: Dict[str,str]):

    loaded_model = load_model('your_model.h5')
    
    input = [data['totalExp'],data['totalWorkOrgs'],  data['monthsInOrg'], data['lastPay'],  data['averageFeedback'],  data['promotion']]
    input = list(map(int, input))
    print(input)
    prediction= loaded_model.predict([input])
    print(prediction)
    prediction = round(prediction[0][1]*100,2)
    return prediction
    
def getAttritionBulk(data):
    np.set_printoptions(precision=2, suppress=True)
    loaded_model = load_model('your_model.h5')
    print(data.to_numpy())
    #predict = np.argmax(loaded_model.predict(data.to_numpy()),axis=1)
    prediction = loaded_model.predict(data.iloc[:,1:].to_numpy())
    predict = prediction[:,1]*100
    output_column = np.array(predict).reshape(-1, 1)
    result_matrix = np.hstack((data.to_numpy(), output_column))
    print(result_matrix)
    return result_matrix



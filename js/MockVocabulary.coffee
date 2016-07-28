class MockVocabulary
  ###* �������� �� ����� ������������ ###
  isIndeclinable:(word) ->
    # ������ ���������� �� ���� (�� �� ��� �� �����)
    if _.contains(['������','����','�����'], word) then true
    else false
  isAnimate:(word) ->
    if _.contains(['���','����������','����'], word) then true
    else if _.contains(['����','�����','�������','������','������',
    '�������','���������','��������','��������','�����','�����','�������','�����'], word) then false
    else null

window.MockVocabulary = MockVocabulary

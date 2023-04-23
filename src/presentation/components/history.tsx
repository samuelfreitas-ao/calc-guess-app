import { View, Pressable, FlatList } from 'react-native'

import { THEME } from '../styles/theme'
import { DateUtils, QuestionUtils } from '../../utils'
import { IQuestion } from '../../@types'

import {
  Text,
  Modal,
  IconTrash,
  IconThumbsUp,
  IconThumbsDown,
  IconClock,
  SimpleButton
} from './'

import { useApp } from '../../hooks'

export function History () {
  const { setShowHistory, setHistoryList, historyList } = useApp()

  return (
    <Modal onClose={setShowHistory}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          rowGap: 4,
          marginTop: 8,
          backgroundColor: THEME.colors.gray[200],
          padding: 16
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text text={`Histórico (${QuestionUtils.quetions.length})`}
            style={{ minWidth: 15, fontFamily: THEME.fonts.heading, fontSize: THEME.fontSizes['xl'] }}
          />
          <SimpleButton onPress={() => setShowHistory(false)}>
            <Text
              text='Fechar'
              style={{
                fontFamily: THEME.fonts.heading,
                backgroundColor: THEME.colors.gray[500],
                padding: 8
              }}
            />
          </SimpleButton>
        </View>
        <FlatList
          data={historyList.sort((a, b) => {
            const x = a.date.getTime(), y = b.date.getTime()
            return x > y ? -1 : (x < y ? 1 : 0)
          })}
          keyExtractor={item => item.date.getTime().toString()}
          renderItem={({ item, index }) => (
            <HistoryItem history={item} index={index + 1} />
          )}
          ListEmptyComponent={() => (
            <View>
              <Text text='Nenhum registo de momento. Inicie o desafio.'
                style={{
                  fontFamily: THEME.fonts.medium,
                  fontSize: THEME.fontSizes.md
                }}
              />
            </View>
          )}
        />
      </View>
    </Modal >
  )
}

type HistoryItemProps = {
  history: IQuestion
  hidenButtonDelete?: boolean
  index?: number
}

export function HistoryItem ({ history, hidenButtonDelete, index }: HistoryItemProps) {
  const { setHistoryList } = useApp()
  const onRemove = (quest: IQuestion) => {
    QuestionUtils.quetions = [...QuestionUtils.quetions].
      filter(questItem => questItem.date != quest.date)
    setHistoryList(QuestionUtils.quetions)
  }
  return (
    <Pressable
      style={{
        borderBottomColor: THEME.colors.gray[500],
        borderBottomWidth: 1,
        padding: 8,
      }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 4,
          marginBottom: 4,
          alignItems: 'center',
        }}
      >
        {index && <Text text={`(${index})`} />}
        <TextBox text={history.value1.toString()} />
        <TextBox text={history.operator} />
        <TextBox text={history.value2.toString()} />
        <TextBox text={'='} />
        <TextBox text={history.answer.toString()} />
        {history.isRight ?
          <IconThumbsUp weight='fill' color={THEME.colors.green[700]} /> :
          <>
            <IconThumbsDown weight='fill' color={THEME.colors.red[700]} />
            <Text
              text={`Resposta certa: ${history.rightAnswer}`}
              style={{
                marginLeft: 4,
                fontFamily: THEME.fonts.heading,
                textAlign: 'right',
              }}
            />
          </>
        }
        {!hidenButtonDelete &&
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <SimpleButton onPress={() => onRemove(history)}>
              <IconTrash weight='fill' color={THEME.colors.gray[800]} />
            </SimpleButton>
          </View>
        }
      </View>
      <View>
        <Text text={`Tempo de resposta: ${history.time}`} />
      </View>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4
      }}>
        <IconClock size={16} />
        <Text text={DateUtils.getDate(new Date(history.date))} />
      </View>
    </Pressable>
  )
}

type TextBoxProps = {
  text: string
}

function TextBox ({ text }: TextBoxProps) {
  return (
    <Text text={text}
      style={{ minWidth: 15, fontSize: THEME.fontSizes.md, fontFamily: THEME.fonts.heading }}
    />
  )
}
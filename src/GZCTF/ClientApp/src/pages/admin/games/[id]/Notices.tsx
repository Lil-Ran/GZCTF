import { Button, Center, Group, ScrollArea, Stack, Text, Title } from '@mantine/core'
import { useModals } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { mdiCheck, mdiKeyboardBackspace, mdiPlus } from '@mdi/js'
import { Icon } from '@mdi/react'
import React, { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GameNoticeEditCard from '@Components/admin/GameNoticeEditCard'
import GameNoticeEditModal from '@Components/admin/GameNoticeEditModal'
import WithGameTab from '@Components/admin/WithGameEditTab'
import { showErrorNotification } from '@Utils/ApiErrorHandler'
import { useTranslation } from '@Utils/I18n'
import { OnceSWRConfig } from '@Utils/useConfig'
import api, { GameNotice } from '@Api'

const GameNoticeEdit: FC = () => {
  const { id } = useParams()
  const numId = parseInt(id ?? '-1')
  const { data: gameNotices, mutate } = api.edit.useEditGetGameNotices(numId, OnceSWRConfig)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeGameNotice, setActiveGameNotice] = useState<GameNotice | null>(null)

  const { t } = useTranslation()

  // delete
  const modals = useModals()
  const onDeleteGameNotice = (gameNotice: GameNotice) => {
    modals.openConfirmModal({
      title: '删除通知',
      children: <Text> 你确定要删除通知该通知吗？</Text>,
      onConfirm: () => onConfirmDelete(gameNotice),
      confirmProps: { color: 'red' },
    })
  }
  const onConfirmDelete = (gameNotice: GameNotice) => {
    api.edit
      .editDeleteGameNotice(numId, gameNotice.id)
      .then(() => {
        showNotification({
          color: 'teal',
          message: '通知已删除',
          icon: <Icon path={mdiCheck} size={1} />,
        })
        mutate(gameNotices?.filter((t) => t.id !== gameNotice.id) ?? [])
      })
      .catch((e) => showErrorNotification(e, t))
  }

  const navigate = useNavigate()
  return (
    <WithGameTab
      headProps={{ position: 'apart' }}
      head={
        <>
          <Button
            leftIcon={<Icon path={mdiKeyboardBackspace} size={1} />}
            onClick={() => navigate('/admin/games')}
          >
            返回上级
          </Button>

          <Group position="right">
            <Button
              leftIcon={<Icon path={mdiPlus} size={1} />}
              onClick={() => {
                setActiveGameNotice(null)
                setIsEditModalOpen(true)
              }}
            >
              新建通知
            </Button>
          </Group>
        </>
      }
    >
      <ScrollArea pos="relative" h="calc(100vh - 180px)" offsetScrollbars>
        {!gameNotices || gameNotices?.length === 0 ? (
          <Center h="calc(100vh - 200px)">
            <Stack spacing={0}>
              <Title order={2}>Ouch! 这个比赛还没有通知</Title>
              <Text>安然无事真好！</Text>
            </Stack>
          </Center>
        ) : (
          <Stack spacing="lg" align="center" m="2%">
            {gameNotices.map((gameNotice) => (
              <GameNoticeEditCard
                w="95%"
                key={gameNotice.id}
                gameNotice={gameNotice}
                onDelete={() => {
                  onDeleteGameNotice(gameNotice)
                }}
                onEdit={() => {
                  setActiveGameNotice(gameNotice)
                  setIsEditModalOpen(true)
                }}
              />
            ))}
          </Stack>
        )}
      </ScrollArea>
      <GameNoticeEditModal
        size="30%"
        title={activeGameNotice ? '编辑通知' : '新建通知'}
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        gameNotice={activeGameNotice}
        mutateGameNotice={(gameNotice: GameNotice) => {
          mutate([gameNotice, ...(gameNotices?.filter((n) => n.id !== gameNotice.id) ?? [])])
        }}
      />
    </WithGameTab>
  )
}

export default GameNoticeEdit

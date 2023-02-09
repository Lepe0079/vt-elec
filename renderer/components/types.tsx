interface ITrack {
  title: string,
  links: {
      ref: string,
      download?: string
  }
}

export type {
  ITrack
}